#!/usr/bin/env bash

AWS_REPO_URI=768297865248.dkr.ecr.us-east-1.amazonaws.com/django-template

docker build . -t django-template-nginx --build-arg NGINX_WORKER_PROCESSES=4 --build-arg NGINX_WORKER_RLIMIT=20000 --build-arg NGINX_WORKER_CONNECTIONS=19000
docker tag django-template-nginx $AWS_REPO_URI:nginx