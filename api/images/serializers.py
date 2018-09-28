from rest_framework import serializers

from images import models
from images.search import Search


class ImageContainer(serializers.Serializer):
    image_count = serializers.SerializerMethodField(read_only=True)
    included_image_count = serializers.SerializerMethodField(read_only=True)

    @staticmethod
    def get_image_count(obj):
        return obj.images.count()

    @staticmethod
    def get_included_image_count(obj):
        return obj.images.filter(included=True).count()


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Image
        fields = ('name', 'included', 'source_url')


class ImageGroupPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageGroup
        fields = ('id', 'name', 'description', 'images')


class ImageGroupListSerializer(ImageContainer, serializers.ModelSerializer):

    class Meta:
        model = models.ImageGroup
        fields = ('id', 'name', 'description', 'owner', 'included_image_count', 'image_count', 'created', 'last_updated')


class ImageGroupDetailSerializer(ImageContainer, serializers.ModelSerializer):

    class Meta:
        model = models.ImageGroup
        fields = ('id', 'name', 'description', 'images', 'owner', 'included_image_count', 'image_count')


class MergeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, allow_blank=False)
    description = serializers.CharField(max_length=120, allow_blank=True)
    delete_after_merge = serializers.BooleanField()
    items = serializers.ListField(
       child=serializers.IntegerField()
    )


class UploadEventSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.UploadEvent
        fields = ('id', 'images', 'owner', 'created', 'last_updated')


class UploadEventListSerializer(serializers.ModelSerializer, ImageContainer):
    image_count = serializers.SerializerMethodField(read_only=True)
    included_image_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.UploadEvent
        fields = ('id', 'images', 'owner', 'included_image_count', 'image_count', 'created', 'last_updated')


class SearchListSerializer(serializers.ModelSerializer):
    image_count = serializers.SerializerMethodField(read_only=True)
    included_image_count = serializers.SerializerMethodField(read_only=True)

    def get_image_count(self, obj):
        return obj.images.count()

    def get_included_image_count(self, obj):
        return obj.images.filter(included=True).count()

    class Meta:
        model = Search
        fields = ('id', 'name', 'description', 'url', 'included_image_count', 'image_count', 'created', 'last_updated')


class SearchSerializer(serializers.ModelSerializer):
    images = ImageSerializer(read_only=True, many=True)

    def validate_url(self, url):
        if 'https://www.google.com/search' not in url:
            raise serializers.ValidationError("URL must be a google image search URL")
        return url

    class Meta:
        model = Search
        fields = ('id', 'name', 'description', 'url', 'created', 'last_updated', 'log', 'images', 'use_pickle')

