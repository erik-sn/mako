import zipfile
import io
import os
import logging
from datetime import datetime
from django.db import models
from django.contrib.auth.models import User as AuthUser
from django.http import HttpResponse

from api.models import Base, Group

logger = logging.getLogger('django')


class Image(Base):
    name = models.CharField(max_length=255, primary_key=True)
    description = models.TextField(default='')
    file_path = models.TextField()
    hash = models.CharField(max_length=255, null=False)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL)
    source_url = models.TextField(null=True)
    resolution = models.IntegerField(null=True)
    included = models.BooleanField(default=True)


class ImageContainer:
    images = models.ManyToManyField(Image)

    def _collect_images(self) -> io.BytesIO:
        """
        retrieve all images in this search and save them to a .zip file
        """

        file_paths = [i.file_path for i in self.images.all()]
        zip_io = io.BytesIO()
        with zipfile.ZipFile(zip_io, mode='w', compression=zipfile.ZIP_DEFLATED) as zip_file:
            for file_path in file_paths:
                try:
                    zip_file.write(file_path, arcname=os.path.basename(file_path))
                except FileNotFoundError:
                    logger.warning(f'missing image {file_path}')
                    continue
        return zip_io

    def build_download_response(self) -> HttpResponse:
        zip_io = self._collect_images()

        timestamp = datetime.now().strftime('%Y-%m-%d_%H.%M')
        response = HttpResponse(zip_io.getvalue(), content_type='application/x-zip-compressed')
        response['Content-Disposition'] = f'attachment; filename={self.name}-images-{timestamp}.zip'
        response['Content-Length'] = zip_io.tell()
        return response


class ImageGroup(Base, ImageContainer):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(default='', blank=True)
    image_groups = models.ManyToManyField('ImageGroup')
    images = models.ManyToManyField(Image)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL)
    groups = models.ManyToManyField(Group)

    def remove_duplicate_images(self):
        existing_hashes = []
        for image in self.images.all():
            if image.hash in existing_hashes:
                self.images.remove(image)
            else:
                existing_hashes.append(image.hash)
        self.save()


class UploadEvent(Base, ImageContainer):
    file_name = models.CharField(max_length=255)
    images = models.ManyToManyField(Image)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL)
    public = models.BooleanField(default=False)
    description = models.TextField(blank=True, default='')
