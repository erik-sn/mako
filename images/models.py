from django.db import models
from django.contrib.auth.models import User

from api.models import Base, Group


class Image(Base):
    name = models.CharField(max_length=255, primary_key=True)
    description = models.TextField(default='')
    file_path = models.TextField()
    hash = models.CharField(max_length=255, null=False)
    owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    source_url = models.TextField(null=True)
    resolution = models.IntegerField(null=True)
    included = models.BooleanField(default=True)


class ImageGroup(Base):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(default='', blank=True)
    image_groups = models.ManyToManyField('ImageGroup')
    images = models.ManyToManyField(Image)
    owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    groups = models.ManyToManyField(Group)

    def remove_duplicate_images(self):
        existing_hashes = []
        for image in self.images.all():
            if image.hash in existing_hashes:
                self.images.remove(image)
            else:
                existing_hashes.append(image.hash)
        self.save()


class UploadEvent(Base):
    images = models.ManyToManyField(Image)
    owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    public = models.BooleanField(default=False)
    description = models.TextField(blank=True, default='')
