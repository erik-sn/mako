#!/usr/bin/env bash

AWS_REPO_URI=$1

# cd up to the root project folder so requirements.txt is available in the Dockerfile
cd ../../..

# because context is now in the root directory we must specify which Dockerfile to use to build
docker build . -f ./deployment/server/celery/Dockerfile -t django-template-celery
docker tag django-template-celery $AWS_REPO_URI:celery