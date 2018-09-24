from django.shortcuts import render
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.decorators import detail_route, action
from rest_framework.serializers import ModelSerializer
from api.utils import save_files

from django.core.files.uploadedfile import InMemoryUploadedFile
from django import forms

import os
import subprocess

from api.serializers import (
    ClassifierSerializer,
    ClassifierReadSerializer,
    TrainingRunSerializer,
    OptionsSerializer,
    SoftwareSerializer,
    FileSerializer,
    FileUploadEventSerializer
)
from api.models import (
    Classifier,
    TrainingRun,
    Software,
    File,
    FileUploadEvent
)


@api_view(['GET'])
def index(request):
    return render(request, 'api/index.html')






class ClassifierViewSet(viewsets.ModelViewSet):
    queryset = Classifier.objects.all()

    def get_serializer_class(self) -> ModelSerializer:
        if self.request.method in ['GET']:
            return ClassifierReadSerializer
        return ClassifierSerializer

    @detail_route(methods=['post'])
    def train(self, request, pk=None) -> Response:
        options = OptionsSerializer(data=request.data)
        options.is_valid(raise_exception=True)

        classifier = get_object_or_404(Classifier, pk=pk)
        training_run = classifier.train(request.data)
        serializer = TrainingRunSerializer(training_run)
        return Response(serializer.data, 201)


class TrainingRunViewset(viewsets.ReadOnlyModelViewSet):
    queryset = TrainingRun.objects.all()
    serializer_class = TrainingRunSerializer


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    
class UploadFileForm(forms.Form):
    file = forms.FileField()

class SoftwareViewSet(viewsets.ModelViewSet):
    """
    view to handle software creation
    """
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

class FileUploadEventViewSet(viewsets.ModelViewSet):
    """
    view to handle uploading of single file
    """
    serializer_class = FileUploadEventSerializer
    model_class = FileUploadEvent
    queryset = model_class.objects.all()

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        form: UploadFileForm = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file: InMemoryUploadedFile = request.FILES['file']
            software_key = request.POST['software']
            software = get_object_or_404(Software, pk=software_key)
            relative_dir = request.POST['relative_dir']
            file_type = request.POST['file_type']

            saved_files, new_file_count = save_files(file, software, relative_dir, file_type)

            upload_event = FileUploadEvent.objects.create(
                owner=request.user, 
                file_name=file.name,
                software=software,
                relative_dir=relative_dir,
                file_type=file_type
                )
            upload_event.files.set(saved_files)
            upload_event.save()

            serializer = FileUploadEventSerializer(upload_event)
            return Response(serializer.data, status=201)

        return Response(form.errors, status=400)
