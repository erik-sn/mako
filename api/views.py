from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.decorators import detail_route, action
from rest_framework.serializers import ModelSerializer

from api.serializers import (
    ClassifierSerializer,
    ClassifierReadSerializer,
    TrainingRunSerializer,
    OptionsSerializer,
    ParameterSerializer,
    DummySerializer,
    SoftwareSerializer,
    WrapperSerializer,
    ResultRunSerializer
)
from api.models import (
    Classifier,
    TrainingRun,
    Dummy,
    Software,
    Wrapper,
    ResultRun
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

class SoftwareViewSet(viewsets.ModelViewSet):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

class WrapperViewSet(viewsets.ModelViewSet):
    queryset = Wrapper.objects.all()
    serializer_class = WrapperSerializer

    @action(methods=['post'], detail=False)
    def get_results(self, request) -> Response:

        output = function(request.data['parameters'])

        wrapper = get_object_or_404(Wrapper, pk=pk)
        results = wrapper.run(request.data, results=output)

        serializer = ResultRunSerializer(results)

        return Response(serializer.data, 201)


class ResultRunViewSet(viewsets.ModelViewSet):
    queryset = ResultRun.objects.all()
    serializer_class = ResultRunSerializer
    
def function(input):
    return 'This is the input: '+str(input)









class DummyViewSet(viewsets.ModelViewSet):
    queryset = Dummy.objects.all()
    serializer_class = DummySerializer
