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

