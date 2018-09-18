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
    ParameterSerializer,
    SoftwareSerializer,
    FileSerializer,
    FileUploadEventSerializer,

    DummyUploadEventSerializer,
    DummySerializer,
    DummySoftwareSerializer,
    DummyResultSerializer,
    DummyFileSerializer
)
from api.models import (
    Classifier,
    TrainingRun,
    Software,
    File,
    FileUploadEvent,

    DummyUploadEvent,
    Dummy,
    DummySoftware,
    DummyResult,
    DummyFile
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

    
# class DocumentViewSet(viewsets.ModelViewSet):#document vs results
#     queryset = Document.objects.all()
#     serializer_class = DocumentSerializers

#     @action(methods=['post'], detail=False) #overwrite create method works too
#     # @detail_route(methods=['post'])
#     def run_fct(self, request) -> Response:
#         #check posted parametrs
#         parameters = ParameterSerializer(data = request.data)
#         parameters.is_valid(raise_exception=True)

#         #run some function and save output
#         output = function(request.data['parameters'])

#         #create results instance and save
#         results = Results.objects.create(
        #     name=request.data['name'], #name both here and in parameters is weird
        #     parameters=request.data['parameters'],
        #     output=output
        # )

#         #serialize
#         serializer = ResultsSerializers(results)
#         return Response(serializer.data, 201)

# results run asynchronous
# ---> "live results" ---> listen to output
# results: get file output
# get array output?


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    
class UploadFileForm(forms.Form):
    file = forms.FileField()

class SoftwareViewSet(viewsets.ModelViewSet):
    """
    view to handle software creation
    """
    serializer_class = SoftwareSerializer
    model_class = Software

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

            saved_files, new_file_count = save_files(file)

            upload_event = FileUploadEvent.objects.create(owner=request.user, file_name=file.name)
            upload_event.files.set(saved_files)
            upload_event.save()

            serializer = FileUploadEventSerializer(upload_event)
            return Response(serializer.data, status=201)

        return Response(form.errors, status=400)

############################ 

class DummyUploadEventViewSet(viewsets.ModelViewSet):
    """
    view to handle uploading of single file
    """
    serializer_class = DummyUploadEventSerializer
    model_class = DummyUploadEvent
    queryset = model_class.objects.all()

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        form: UploadFileForm = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file: InMemoryUploadedFile = request.FILES['file']

            saved_files, new_file_count = save_files(file)

            upload_event = DummyUploadEvent.objects.create(owner=request.user, file_name=file.name)
            upload_event.files.set(saved_files)
            upload_event.save()

            serializer = DummyUploadEventSerializer(upload_event)
            return Response(serializer.data, status=201)

        return Response(form.errors, status=400)

class DummySoftwareViewSet(viewsets.ModelViewSet):
    queryset = DummySoftware.objects.all()
    serializer_class = DummySoftwareSerializer

    def create(self, request) -> Response:
        DIR = str(request.data["root_dir"])
        if not os.path.exists(DIR):
            os.makedirs(DIR)
        os.chdir(DIR)
        form: UploadFileForm = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            files = request.FILES.get('file')
            # file: InMemoryUploadedFile = request.FILES['file']
        # files = request.FILES["files"]
        # with open("result_test.py") as f:
        f = os.fdopen("result_test.py", 'w')
        f.write(files.read())
        f.close()

        software = DummySoftware.objects.create(
            name = request.data["name"],
            run_command = request.data["run_command"],
            root_dir = DIR
        )

        serializer = DummySoftwareSerializer(software)
        return Response(serializer.data)


    # @action(methods=['post'], detail=False)
    # # @detail_route(methods=['post'])
    # def create_results(self, request) -> Response:

    #     used_software = get_object_or_404(DummySoftware, id=1)


    #     # os.chdir('./')
    #     # print(os.getcwd())
    #     # output = subprocess.call(used_software['run_command'])
    #     output = function(42)
    #     results = DummyResult.objects.create(
    #         results = output,
    #         software = used_software
    #     )

    #     serializer = DummyResultSerializer(result)
    #     return Repsonse(serializer.data)

# check error key is not present in table: use postman? X
# 1. try postman to run software with os X
# 2. save file through some utils.py modules (in some dir)
# 3. run file in this reative directory
class DummyResultViewSet(viewsets.ModelViewSet):
    queryset = DummyResult.objects.all()
    serializer_class = DummyResultSerializer

    # @action(methods=['post'], detail=False)
    def create(self, request) -> Response:

        # DIR = os.path.join('/api/files', str(request.data["software_id"]))
        # if not os.path.exists(DIR):
        #     os.makedirs(DIR)
        DIR = '/api'

        used_software = get_object_or_404(DummySoftware, pk=request.data["software_id"])
        print()
        print(DIR)
        print()

        #CREATE THE FILE FIRST PER request.FILE!!!!!!!!!
        os.chdir(DIR)
        os.getcwd()
        # print(os.getcwd())
        output = subprocess.call(used_software.run_command)
        # output = function(42)
        results = DummyResult.objects.create(
            results = output,
            # software_id = request.data["software_id"] # ?????
        )

        results.software_id = request.data["software_id"]
        print()
        print(results.software_id)
        print()
        # results.save()
        serializer = DummyResultSerializer(results)
        return Response(serializer.data)


class DummyFileViewSet(viewsets.ModelViewSet):
    queryset = DummyFile.objects.all()
    serializer_class = DummyFileSerializer

class DummyViewSet(viewsets.ModelViewSet):
    queryset = Dummy.objects.all()
    serializer_class = DummySerializer
