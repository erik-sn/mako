#!/usr/bin/env bash

# configure docker to save built docker images in minikube
eval $(minikube docker-env)

# build api docker container
cd api
docker build -t mako_api -f docker/api/Dockerfile .
cd ..

# build celery docker container
cd api
docker build -t mako_celery -f docker/celery/Dockerfile .
cd ..

# build web docker container
cd frontend
docker build -t mako_web -f docker/Dockerfile .
cd ..

