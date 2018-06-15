#!/usr/bin/env bash

docker build . -t django-template-rabbitmq --build-arg RABBITMQ_DEFAULT_USER=test --build-arg RABBITMQ_DEFAULT_PASS=testpass
docker tag django-template-rabbitmq $1:rabbitmq
