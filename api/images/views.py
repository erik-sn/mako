import logging
from django.core.files.uploadedfile import InMemoryUploadedFile
from django import forms
from django.db.utils import IntegrityError
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import list_route
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.serializers import ModelSerializer
from rest_framework import status

from images.utils import unzip_and_save_files, assert_compressed_file, create_image_group
from images.serializers import (
    ImageSerializer,
    ImageGroupDetailSerializer,
    ImageGroupListSerializer,
    ImageGroupPostSerializer,
    MergeSerializer,
    UploadEventSerializer,
    UploadEventListSerializer,
    SearchListSerializer,
    SearchSerializer,
)
from images.models import (
    Image,
    ImageGroup,
    UploadEvent,
)
from images.search import Search


logger = logging.getLogger('django')


class UploadFileForm(forms.Form):
    file = forms.FileField()


class ImageContainerView:
    model_class = None

    @detail_route(methods=['get'])
    def download_images(self, request, pk: int) -> HttpResponse:
        image_container = get_object_or_404(self.model_class, pk=pk)
        return image_container.build_download_response()


class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    lookup_field = 'slug'

    @staticmethod
    def _include_image(image):
        image.included = True
        image.save()
        return image

    @staticmethod
    def _exclude_image(image):
        image.included = False
        image.save()
        return image

    @detail_route(methods=['put'])
    def toggle(self, request, slug=None):
        value = request.GET.get('value', None)
        try:
            image = self.queryset.get(slug__contains=slug)
        except Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if value:
            bool_value = value.lower() == 'true'
            if bool_value:
                image = self._exclude_image(image)
            else:
                image = self._include_image(image)
        else:
            if image.included:
                image = self._exclude_image(image)
            else:
                image = self._include_image(image)

        serializer = self.serializer_class(image)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ImageGroupViewSet(viewsets.ModelViewSet, ImageContainerView):
    """
    Image Group viewset
    """
    model_class = ImageGroup
    queryset = model_class.objects.all()

    def get_serializer_class(self) -> ModelSerializer:
        if self.request.method in ['GET']:
            return ImageGroupDetailSerializer
        return ImageGroupPostSerializer

    def list(self, request, **kwargs) -> Response:
        # TODO see if we can make this filter generic
        image_groups = self.queryset.filter(owner=request.user)
        serializer = ImageGroupListSerializer(image_groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class UploadEventViewSet(viewsets.ModelViewSet, ImageContainerView):
    """
    view to handle uploading of single, multiple or gzipped
    images
    """
    serializer_class = UploadEventSerializer
    model_class = UploadEvent
    queryset = model_class.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return UploadEventListSerializer
        return UploadEventSerializer

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    @list_route(methods=['post'])
    def merge(self, request) -> Response:
        serializer = MergeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            upload_event_ids = serializer.data['items']

            try:
                upload_events = [UploadEvent.objects.get(id=id) for id in upload_event_ids]
                image_group = create_image_group(upload_events, serializer, request.user)
            except UploadEvent.DoesNotExist:
                return Response({
                    'generic': ['Could not find one of the selected google searches - contact an administrator']
                }, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError:
                return Response({
                    'name': ['Image group with this name already exists']
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response(ImageGroupDetailSerializer(image_group).data, status=status.HTTP_201_CREATED)

    def create(self, request, *args, **kwargs):
        form: UploadFileForm = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file: InMemoryUploadedFile = request.FILES['file']
            if not assert_compressed_file(file):
                return Response('Invalid file type', status=status.HTTP_400_BAD_REQUEST)
            saved_images, new_image_count = unzip_and_save_files(file)

            # case where the user uploaded either a blank directory or a directory
            # that contains no images, or contains invalid image types as defined in the
            # image config admin
            if len(saved_images) == 0:
                return Response({
                    'generic': ['Uploaded archive has no valid images']
                }, status=status.HTTP_400_BAD_REQUEST)

            upload_event = UploadEvent.objects.create(owner=request.user, file_name=file.name)
            upload_event.images.set(saved_images)
            upload_event.save()

            serializer = UploadEventSerializer(upload_event)
            return Response(serializer.data, status=201)

            # # case where duplicate file was uploaded
            # return Response({}, status=201)
        return Response(form.errors, status=400)


class SearchViewset(viewsets.ModelViewSet, ImageContainerView):
    model_class = Search
    queryset = model_class.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return SearchListSerializer
        return SearchSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @list_route(methods=['post'])
    def merge(self, request) -> Response:
        serializer = MergeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            search_ids = serializer.data['items']

            try:
                searches = [Search.objects.get(id=id) for id in search_ids]
                image_group = create_image_group(searches, serializer, request.user)
            except Search.DoesNotExist:
                return Response({
                    'generic': ['Could not find one of the selected google searches - contact an administrator']
                }, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError:
                return Response({
                    'name': ['Image group with this name already exists']
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response(ImageGroupDetailSerializer(image_group).data, status=201)