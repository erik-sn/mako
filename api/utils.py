from django.core.files.uploadedfile import InMemoryUploadedFile
from django.conf import settings
from mako.models import FileConfig
from api.models import File
import logging
from typing import List, Tuple
import uuid
from uuid import UUID
import os
import pathlib
import zipfile
import tarfile
import hashlib
from shutil import copyfile, rmtree

logger = logging.getLogger('django')

SAVED_FILES = settings.SAVED_FILES

######
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
######

#to-do: get rid of list stuff
def save_files(uploaded_file: InMemoryUploadedFile, software, relative_dir, file_type) -> (List[File], int):
    """ process all requested files

    Parameters
    ----------
    uploaded_file : InMemoryUploadedFile
        file uploaded by the user
    software : Software object
        software that the file is related to
    relative_dir : str
        relative directory within software
    file_type : str
        file type within software

    Returns
    -------
    tuple (list of File objects, list of FileObjects)
        first item is a list of all new File objects that were created and
        the second item is a list of all File objects that were found
        to be duplicates

    """
    #get valid file type
    valid_file_types = FileConfig.objects.load().valid_file_formats
    valid_file_types_str = ','.join(valid_file_types)
    logger.debug(f'valid file types: {valid_file_types_str}')

    #create a unique temporary directory and save files to it
    unique_dir = uuid.uuid4()  # scope all operations to a directory for this request
    temp_file_path = save_to_temp(unique_dir, uploaded_file)
    logger.info(f'Begining file processing for: {temp_file_path}')
    logger.info(f'Checking for file extensions using: {valid_file_types_str}')

    #process files in temp directory and save to permanent one
    saved_files = []
    new_files = 0
    #get valid and unique files
    for file_name, file_path in process_files(valid_file_types, temp_file_path):
        #hash file
        hash_string = hash_file(file_path)
        #create new file object
        saved_file = save_file(file_name, file_path, hash_string, software, relative_dir, file_type)
        new_files += 1
        saved_files.append(saved_file)

    #remove temp directory
    clean_temp_directory(temp_file_path)
    logger.info(f'Finished processing files. Total: {len(saved_files)} New: {new_files}')
    return saved_files, new_files

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
    file_directory = f'files/temp/{unique_dir}'
    file_path = f'{file_directory}/{file.name}'
    if not os.path.exists(file_directory):
        os.makedirs(file_directory)
    with open(file_path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    return file_path

#add check to file type
def process_files(valid_file_types: List[str], temp_file_path: str) -> List[Tuple[str, str]]:
    """Checks that file in the temp directory that is valid software files
    Returns
    -------
    list of str
        list of files with an software extension
    """
    software = []
    logger.info(f'Processing files in {os.path.dirname(temp_file_path)}')
    for root, dirs, files in os.walk(os.path.dirname(temp_file_path)):
        for file in files:
            if is_software_file(valid_file_types, os.path.join(root, file)):
                software.append((file, os.path.join(root, file)))
    logger.info(f'Processed files: {software}')
    return software

def is_software_file(valid_file_types: List[str], file_path: str) -> bool:
    """

    Parameters
    ----------
    file_path : str
        path to the file we are checking

    Returns
    -------
    bool
        if the file name has an software extension
    """
    file_type = ''.join(pathlib.Path(file_path).suffixes)
    valid_file = file_type in valid_file_types
    if not valid_file:
        logger.warning(f'Ignoring for incorrect file type: {file_type} - {file_path} among {valid_file_types}')
    return valid_file

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

def save_file(file_name: str, file_path: str, hash_string: str, software_key, relative_dir, file_type) -> File:
    """save a file into the database

    Parameters
    ----------
    file_name : str
        original name of the file
    file_path : str
        full file path
    hash_string: str
        md5 hash of the file

    Returns
    -------
    File
        File object created in the database

    """
    _, file_extension = os.path.splitext(file_name)
    uuid_name = f'{uuid.uuid4()}{file_extension}'
    save_path = os.path.join(SAVED_FILES, uuid_name)
    copyfile(file_path, save_path)
    
    latest_file = File.objects.filter(hash=hash_string, software=software_key)
    if latest_file.exists():
        logger.debug(f'File already exists: {file_name}')
        new_version = getattr(latest_file.latest('version'), 'version')+1
    else:
        logger.debug(f'New File is being created: {file_name} at {file_path}')
        new_version = 0

    return File.objects.create(
        name = file_name,
        uuid_name=uuid_name,
        file_path=save_path,
        hash=hash_string,
        version=new_version,
        software=software_key,
        relative_dir=relative_dir,
        file_type=file_type
    )

def clean_temp_directory(temp_file_path: str) -> None:
    """remove all files & directories from the temp directory

    Parameters
    ----------
    temp_file_path - file path of the original file uploaded by the user

    """
    logger.debug(f'Clearing temporary file path: {os.path.dirname(temp_file_path)}')

    rmtree(os.path.dirname(temp_file_path))