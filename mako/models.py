from django.db import models
from django.contrib.postgres.fields import ArrayField


class ConfigManager(models.Manager):
    def load(self):
        config, created = self.get_or_create(pk=1)
        return config


class SiteConfig(models.Model):
    show_unavailable = models.BooleanField(default=False)
    throw_api_400s = models.BooleanField(default=False)
    throw_api_500s = models.BooleanField(default=False)

    objects = ConfigManager()

    def __str__(self):
        return 'Mako general site configuration'

    def delete(self, *args, **kwargs):
        return NotImplementedError('The site configuration cannot be deleted')

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class ImageConfig(models.Model):
    valid_image_formats = ArrayField(models.CharField(max_length=10), default=['png', 'jpeg', 'jpg'])

    objects = ConfigManager()

    def __str__(self):
        return 'Mako images configuration'

    def delete(self, *args, **kwargs):
        return NotImplementedError('The image configuration cannot be deleted')

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

class FileConfig(models.Model):
    valid_file_formats = ArrayField(models.CharField(max_length=10), default=['py', 'c', 'cpp'])

    objects = ConfigManager()

    def __str__(self):
        return 'Mako file configuration'

    def delete(self, *args, **kwargs):
        return NotImplementedError('The file configuration cannot be deleted')

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)