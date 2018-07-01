import hashlib
import os
import tarfile
import zipfile
from shutil import copyfile, rmtree
import uuid
from uuid import UUID
import gzip
import logging
import imghdr
from typing import List, Tuple
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.conf import settings
from django.db.models import Model
from django.contrib.auth.models import User
from rest_framework.serializers import Serializer

from images.models import Image, ImageGroup


logger = logging.getLogger('django')


TEMP_IMAGES = os.path.join(settings.TEMP_IMAGES, 'extracted_temp')
if not os.path.exists(TEMP_IMAGES):
    os.makedirs(TEMP_IMAGES)

SAVED_IMAGES = settings.SAVED_IMAGES


def create_image_group(items: List[Model], serializer: Serializer, user: User) -> ImageGroup:
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


def assert_compressed_file(file: InMemoryUploadedFile) -> bool:
    """ determine if input is a compressed file

    Parameters
    ----------
    file : django.core.files.uploadedfile.InMemoryUploadedFile
        File uploaded by the user

    Returns
    -------
    bool
        True if the file is a zip or gzip file, False otherwise

    """
    try:
        with gzip.open(file, 'rb') as gzip_file:
            gzip_file.read()
        return True
    except OSError:
        pass
    try:
        with zipfile.ZipFile(file, 'r') as zip_file:
            zip_file.testzip()
        return True
    except OSError:
        return False


def save_to_temp(unique_dir: UUID, file: InMemoryUploadedFile) -> str:
    """ Save the file to temporary storage
    Parameters
    ----------
    unique_dir: UUID
        unique directory that this operation is scoped to
    file : django.core.files.uploadedfile.InMemoryUploadedFile
        File uploaded by the user

    Returns
    -------
    file_path : str
        file path of the saved file
    """
    file_directory = f'images/temp/{unique_dir}'
    file_path = f'{file_directory}/{file.name}'
    if not os.path.exists(file_directory):
        os.makedirs(file_directory)

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
    if tarfile.is_tarfile(file_path):
        with tarfile.open(file_path, "r:*") as tar_file:
            tar_file.extractall(path=TEMP_IMAGES)

    elif zipfile.is_zipfile(file_path):
        with zipfile.ZipFile(file_path, 'r') as zip_file:
            zip_file.extractall(path=TEMP_IMAGES)


def is_image_file(file_path: str) -> bool:
    """

    Parameters
    ----------
    file_path : str
        path to the file we are checking

    Returns
    -------
    bool
        if the file name has an image extension
    """
    file_type = imghdr.what(file_path)
    valid_image = file_type in ['jpg', 'jpeg', 'png']
    if not valid_image:
        logger.warning(f'Ignoring for incorrect image type: {file_type} - {file_path}')
    return valid_image


def process_images() -> List[Tuple[str, str]]:
    """Find all files in the temp directory that are image files
    Returns
    -------
    list of str
        list of files with an image extension
    """
    images = []
    for root, dirs, files in os.walk(TEMP_IMAGES):
        for file in files:
            if is_image_file(os.path.join(root, file)):
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
        hash_string = md5.hexdigest()
        logger.debug(f'Created hash {hash_string} for file: {file_path}')
        return hash_string


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
    logger.debug(f'Clearing temporary file path: {temp_file_path}')
    for the_file in os.listdir(TEMP_IMAGES):
        file_path = os.path.join(TEMP_IMAGES, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                rmtree(file_path)
        except Exception as e:
            logger.exception('message')
    os.unlink(temp_file_path)


def unzip_and_save_files(compressed_file: InMemoryUploadedFile) -> (List[Image], int):
    """unzip the compressed directory and process all containing images

    Parameters
    ----------
    compressed_file : InMemoryUploadedFile
        file uploaded by the user

    Returns
    -------
    tuple (list of Image objects, list of ImageObjects)
        first item is a list of all new Image objects that were created and
        the second item is a list of all Image objects that were found
        to be duplicates

    """
    unique_dir = uuid.uuid4()  # scope all operations to a directory for this request
    temp_file_path = save_to_temp(unique_dir, compressed_file)
    logger.info(f'Begining image processing for: {temp_file_path}')

    saved_images = []
    new_images = 0
    for file_name, file_path in process_images():
        hash_string = hash_file(file_path)
        try:
            saved_image = Image.objects.get(hash=hash_string)
            logger.debug(f'Image already exists: {file_name}')
        except Image.DoesNotExist:
            saved_image = save_image(file_name, file_path, hash_string)
            logger.debug(f'Created new image: {file_name} at {file_path}')
            new_images += 1
        saved_images.append(saved_image)

    clean_temp_directory(temp_file_path)
    logger.info(f'Finished processing images. Total: {len(saved_images)} New: {new_images}')
    return saved_images, new_images
