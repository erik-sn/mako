from rest_framework import serializers
from django.contrib.auth.models import User

from api import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'is_staff')


class LoginRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.LoginRecord
        fields = ('created', 'ip_address', 'user_agent')


class ClassifierSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Classifier
        fields = ('id', 'name', 'description', 'image_groups')


class ClassifierReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Classifier
        fields = ('id', 'name', 'description', 'transforms', 'image_groups')
        depth = 1


class TrainingRunSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.TrainingRun
        fields = ('id', 'created', 'name', 'task_id', 'status', 'progress', 'accuracy',
                  'labels', 'classifier', 'model', 'training_steps', 'testing_percentage')
        depth = 1


class OptionsSerializer(serializers.Serializer):
    model = serializers.CharField(max_length=255)
    training_steps = serializers.IntegerField(min_value=1, max_value=10000)
    testing_percentage = serializers.IntegerField(min_value=1, max_value=99)


class SoftwareSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Software
        fields = '__all__'

class FileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.File
        fields = '__all__'

class FileUploadEventSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = models.FileUploadEvent
        fields = ('id', 'files', 'owner', 'created', 'last_updated')

class ParameterSerializer(serializers.Serializer):
    parameters = serializers.CharField(max_length=20)



##########################################################
##########################################################

class DummyFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.DummyFile
        fields = '__all__'

class DummyUploadEventSerializer(serializers.ModelSerializer):
    files = DummyFileSerializer(many=True, read_only=True)

    class Meta:
        model = models.DummyUploadEvent
        fields = ('id', 'files', 'owner', 'created', 'last_updated')

class DummySoftwareSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.DummySoftware
        fields = '__all__'

class DummyResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.DummyResult
        fields = '__all__'

class DummySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Dummy
        fields = '__all__'