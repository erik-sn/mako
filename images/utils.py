import hashlib
import os
import tarfile
from shutil import copyfile, rmtree
import uuid
import gzip
from typing import List
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.conf import settings
from django.db.models import Model
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

from images.models import Image, ImageGroup


TEMP_IMAGES = os.path.join(settings.TEMP_IMAGES, 'extracted_temp')
if not os.path.exists(TEMP_IMAGES):
    os.makedirs(TEMP_IMAGES)

SAVED_IMAGES = settings.SAVED_IMAGES


def create_image_group(items: List[Model], serializer: ModelSerializer, user: User) -> ImageGroup:
    """
    create and populate an image group

    Parameters
    ----------
    items: List[Model]:
        a list of models that have an images property
    serializer: ModelSerializer
        DRF seralizer that has been validated
    user: django.contrib.auth.models
        user who is creating this ImageGroup

    Returns
    -------
    ImageGroup
        the image group that was created

    """
    name = serializer.data['name']
    description = serializer.data['description']
    delete_after_merge = serializer.data['delete_after_merge']

    image_group = ImageGroup.objects.create(
        name=name,
        description=description,
        owner=user,
    )

    all_included_images = []
    for model_object in items:
        search_included_images = model_object.images.filter(included=True).all()
        for image in search_included_images:
            all_included_images.append(image)

    image_group.images.set(all_included_images)
    image_group.save()
    image_group.remove_duplicate_images()

    if delete_after_merge:
        for model_object in items:
            model_object.delete()

    return image_group


def check_if_gz_file(file: InMemoryUploadedFile) -> bool:
    """ determine if input is a gzip file

    Parameters
    ----------
    file : django.core.files.uploadedfile.InMemoryUploadedFile
        File uploaded by the user

    Returns
    -------
    bool
        True if the file is a gzip file, False otherwise

    """
    if not file.name.endswith('.gz'):
        return False

    try:
        with gzip.open(file, 'rb') as f:
            f.read()
        return True
    except OSError:
        return False


def save_to_temp(file: InMemoryUploadedFile) -> str:
    """ Save the file to temporary storage
    Parameters
    ----------
    file : django.core.files.uploadedfile.InMemoryUploadedFile
        File uploaded by the user

    Returns
    -------
    file_path : str
        file path of the saved file
    """
    file_path = f'images/temp/{file.name}'
    with open(file_path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    extract_contents(file_path)
    return file_path


def extract_contents(file_path: str) -> None:
    """Extract file contents to the temp directory

    Parameters
    ----------
    file_path : str
        file path of the gzip directory to be extracted
    """
    if file_path.endswith("tar.gz"):
        tar = tarfile.open(file_path, "r:gz")
        tar.extractall(path=TEMP_IMAGES)
        tar.close()
    elif file_path.endswith("tar"):
        tar = tarfile.open(file_path, "r:")
        tar.extractall(path=TEMP_IMAGES)
        tar.close()


def is_image_file(file_name: str) -> bool:
    """

    Parameters
    ----------
    file_name : str
        name of the file to check

    Returns
    -------
    bool
        if the file name has an image extension
    """
    return file_name.endswith('.jpg')


def process_images() -> List[str]:
    """Find all files in the temp directory that are image files
    Returns
    -------
    list of str
        list of files with an image extension
    """
    images = []
    for root, dirs, files in os.walk(TEMP_IMAGES):
        for file in files:
            if is_image_file(file):
                images.append((file, os.path.join(root, file)))
    return images


def hash_file(file_path: str) -> str:
    """Generate a hash for the file located at this file path

    Parameters
    ----------
    file_path : str
        file path to hash

    Returns
    -------
    str
        md5 hash of the file

    """
    md5 = hashlib.md5()
    with open(file_path, 'rb') as file:
        for chunk in iter(lambda: file.read(4096), b''):
            md5.update(chunk)
        return md5.hexdigest()


def save_image(file_name: str, file_path: str, hash_string: str) -> Image:
    """save an image into the database

    Parameters
    ----------
    file_name : str
        original name of the file
    file_path : str
        full file path
    hash_string: str
        md5 hash of the image

    Returns
    -------
    Image
        Image object created in the database

    """
    _, file_extension = os.path.splitext(file_name)
    uuid_name = f'{uuid.uuid4()}{file_extension}'
    save_path = os.path.join(SAVED_IMAGES, uuid_name)
    copyfile(file_path, save_path)
    return Image.objects.create(
        name=uuid_name,
        file_path=save_path,
        hash=hash_string,
    )


def clean_temp_directory(temp_file_path: str) -> None:
    """remove all files & directories from the temp directory

    Parameters
    ----------
    temp_file_path - file path of the original file uploaded by the user

    """
    for the_file in os.listdir(TEMP_IMAGES):
        file_path = os.path.join(TEMP_IMAGES, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                rmtree(file_path)
        except Exception as e:
            print(e)
    os.unlink(temp_file_path)


def unzip_and_save_files(gzip_file: InMemoryUploadedFile) -> (List[Image], List[Image]):
    """unzip the gzip directory and process all containing images

    Parameters
    ----------
    gzip_file : InMemoryUploadedFile
        file uploaded by the user

    Returns
    -------
    tuple (list of Image objects, list of ImageObjects)
        first item is a list of all new Image objects that were created and
        the second item is a list of all Image objects that were found
        to be duplicates

    """
    temp_file_path = save_to_temp(gzip_file)

    saved_images = []
    new_images = 0
    for file_name, file_path in process_images():
        hash_string = hash_file(file_path)
        try:
            saved_image = Image.objects.get(hash=hash_string)
        except Image.DoesNotExist:
            saved_image = save_image(file_name, file_path, hash_string)
            new_images += 1
        saved_images.append(saved_image)

    clean_temp_directory(temp_file_path)
    return saved_images, new_images
