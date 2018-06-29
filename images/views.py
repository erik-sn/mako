from datetime import datetime
import logging
import io
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

from images.utils import unzip_and_save_files, check_if_gz_file, create_image_group
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


class ImageGroupViewSet(viewsets.ModelViewSet):
    """
    Image Group viewset
    """
    queryset = ImageGroup.objects.all()

    def get_serializer_class(self) -> ModelSerializer:
        if self.request.method in ['GET']:
            return ImageGroupDetailSerializer
        return ImageGroupPostSerializer

    def list(self, request, **kwargs) -> Response:
        image_groups = self.queryset.filter(owner=request.user)
        serializer = ImageGroupListSerializer(image_groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadEventViewSet(viewsets.ModelViewSet):
    """
    view to handle uploading of single, multiple or gzipped
    images
    """
    queryset = UploadEvent.objects.all()
    serializer_class = UploadEventSerializer

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

            return Response(ImageGroupDetailSerializer(image_group).data, status=201)

    def create(self, request, *args, **kwargs):
        form: UploadFileForm = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file: InMemoryUploadedFile = request.FILES['file']
            if not check_if_gz_file(file):
                return Response('Invalid file type - .gz required', 400)

            saved_images, new_image_count = unzip_and_save_files(file)
            upload_event = UploadEvent.objects.create(owner=request.user)
            upload_event.images.set(saved_images)
            upload_event.save()

            serializer = UploadEventSerializer(upload_event)
            return Response(serializer.data, status=201)

            # # case where duplicate file was uploaded
            # return Response({}, status=201)
        return Response(form.errors, status=400)


class SearchViewset(viewsets.ModelViewSet):
    queryset = Search.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return SearchListSerializer
        return SearchSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @detail_route(methods=['get'])
    def download_images(self, request, pk: int) -> HttpResponse:
        google_search = get_object_or_404(Search, pk=pk)
        zip_io = google_search.collect_images()

        timestamp = datetime.now().strftime('%Y-%m-%d_%H.%M')
        response = HttpResponse(zip_io.getvalue(), content_type='application/x-zip-compressed')
        response['Content-Disposition'] = f'attachment; filename={google_search.name}-images-{timestamp}.zip'
        response['Content-Length'] = zip_io.tell()
        return response

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

    def create(self, request, *args, **kwargs):
        # serializer = self.get_serializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        #
        # search = serializer.save()
        # # args = Argument(serializer.validated_data['url'])
        # # self._analyze_google_image_search(search, args)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)