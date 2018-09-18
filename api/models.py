import os

from django.conf import settings
from django.urls import reverse
from django.db import models as models
from django.utils import timezone
from django_extensions.db import fields as extension_fields
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.contrib.auth.models import User as AuthUser

######
# def _create_unique_directory(name) -> str:
#     timestamp: str = timezone.now().strftime('%Y-%m-%d_%H-%M-%S')
#     unique_dir_name = f'{name}_{timestamp}'
#     dir_path: str = os.path.join(settings.SAVED_FILES, unique_dir_name)
#     os.makedirs(dir_path)
#     return dir_path
######


class Base(models.Model):
    name = models.CharField(max_length=255)
    slug = extension_fields.AutoSlugField(populate_from='name', blank=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True
        ordering = ('-created',)

    def __unicode__(self):
        return u'%s' % self.slug

    def get_absolute_url(self):
        return reverse('api_group_detail', args=(self.slug,))

    def get_update_url(self):
        return reverse('api_group_update', args=(self.slug,))


class Group(Base):
    description = models.TextField()


class LoginRecord(Base):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    ip_address = models.CharField(max_length=255, blank=True, null=True)
    user_agent = models.CharField(max_length=255, blank=True, null=True)
    slug = None


class Transform(Base):
    description = models.TextField()


class TrainingRun(Base):
    classifier = models.ForeignKey('Classifier', null=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=255)
    image_dir = models.CharField(max_length=255)
    task_id = models.CharField(blank=True, null=True, max_length=36)
    status = models.CharField(max_length=255, default='inactive', choices=[
        ('inactive', 'Inactive'),
        ('paused', 'Paused'),
        ('in_progress', 'In Progress'),
        ('downloading', 'Downloading Classifier'),
        ('bottleneck', 'Creating Bottlenecks'),
        ('training', 'Training'),
        ('error', 'Error'),
        ('complete', 'Complete'),
    ])
    model = models.CharField(max_length=255)
    training_steps = models.IntegerField()
    testing_percentage = models.FloatField()

    # tensorflow results
    progress = models.FloatField(null=True)
    output_graph = models.TextField(blank=True, null=True)
    labels = ArrayField(models.CharField(max_length=100), null=True)
    accuracy = models.FloatField(null=True)

    def set_status(self, status):
        self.status = status
        self.save()

    def set_output_graph_location(self):
        file_path = os.path.join(settings.BASE_DIR, 'training', self.name, 'retrained_graph.pb')
        self.output_graph = file_path
        self.save()


class Classifier(Base):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(default='', blank=True)
    transforms = models.ManyToManyField(Transform)
    image_groups = models.ManyToManyField('images.ImageGroup', blank=True)

    def train(self, options) -> TrainingRun:
        training_run_name, image_dir = self._create_image_directories()

        training_run = TrainingRun.objects.create(
            name=training_run_name,
            image_dir=image_dir,
            classifier=self,
            **options,
        )
        training_run.classifier = self
        training_run.save()

        # task_id = train_classifier.delay(training_run.id)
        # training_run.task_id = task_id
        training_run.save()
        return training_run

    def _create_image_directories(self) -> (str, str):
        dir_name, dir_path = self._create_unique_directory()
        for image_group in self.image_groups.all():
            image_group.copy_to_directory(dir_path)
        return dir_name, dir_path

    @staticmethod
    def _create_unique_directory() -> (str, str):
        timestamp: str = timezone.now().strftime('%Y-%m-%d_%H-%M-%S')
        unique_dir_name = f'training_run_{timestamp}'
        dir_path: str = os.path.join(settings.TEMP_IMAGES, unique_dir_name)
        os.makedirs(dir_path)
        return unique_dir_name, dir_path

# to-do:
# saving files: # software gets assigned a unique dir
                # file is hashed and saved in that directory
                    # upload event should be incorporated in software create method
                    # upload event can also be separated from software create method
                        #file creation requires software
                    #multiple files can eb separated by version number
                # forget run command for now ...  
#run a command in a container with a software consisting of  


class Software(models.Model):
    name = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    readme = models.TextField(default='', blank=True)
    run_command = models.CharField(max_length=255, blank=True)

    # root_dir = models.CharField(
    #     max_length=255, 
    #     default=_create_unique_directory(name),
    #     editable=False
    # )

class File(models.Model):
    name = models.CharField(max_length=255)
    file_path = models.TextField()
    hash = models.CharField(max_length=255, null=False)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    file_type = models.CharField(max_length=255, default='static', choices=[
        ('static', 'Static'),
        ('variable', 'Variable'),
        ('parameters', 'Parameters'),
        ('input', 'Input'),
        ('results', 'Results'),
        ('output', 'Output')
    ])
    software = models.ForeignKey('Software', on_delete=models.CASCADE)
    version = models.IntegerField(default=0)
    relative_dir = models.CharField(max_length=255)

class FileUploadEvent(models.Model):
    file_name = models.CharField(max_length=255)
    files = models.ManyToManyField(File)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL, related_name="auth_user")
    public = models.BooleanField(default=False)

#####
class DummyFile(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    description = models.TextField(default='')
    file_path = models.TextField()
    hash = models.CharField(max_length=255, null=False)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL)

class DummyUploadEvent(Base):
    file_name = models.CharField(max_length=255)
    files = models.ManyToManyField(DummyFile)
    owner = models.ForeignKey(AuthUser, null=True, on_delete=models.SET_NULL, related_name="dummy_auth_user")
    public = models.BooleanField(default=False)
    description = models.TextField(blank=True, default='')

class DummySoftware(models.Model):
    name = models.CharField(max_length=255, unique=True)
    root_dir = models.CharField(max_length=255)
    run_command = models.CharField(max_length=255)

class DummyResult(models.Model):
    results = models.CharField(max_length=255, null=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    software = models.ForeignKey('DummySoftware', null=True, on_delete=models.CASCADE)

class Dummy(models.Model):
    name = models.CharField(max_length=255)



