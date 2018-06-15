#!/usr/bin/env bash

AWS_REPO_URI=$1

# cd up to the root project folder so requirements.txt is available in the Dockerfile
cd ../../..

cd /test/here

# because context is now in the root directory we must specify which Dockerfile to use to build
docker build . --no-cache -f ./deployment/server/api/Dockerfile -t django-template-api
docker tag django-template-api $AWS_REPO_URI:api