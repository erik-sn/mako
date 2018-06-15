from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.serializers import ModelSerializer

from api.serializers import (
    ClassifierSerializer,
    ClassifierReadSerializer,
    TrainingRunSerializer,
    OptionsSerializer,
)
from api.models import (
    Classifier,
    TrainingRun
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
