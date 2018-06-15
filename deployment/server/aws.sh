#!/usr/bin/env bash

# bash ./aws.sh AKIAIFRYHOPOK2TIS4GA RONwFwJM/ng/AK46/DMvkJ2Ylkuf3mUU0QwMcoIX us-east-1 768297865248.dkr.ecr.us-east-1.amazonaws.com/django-template
AWS_KEY=$1 # AKIAIFRYHOPOK2TIS4GA
AWS_SECRET=$2 #RONwFwJM/ng/AK46/DMvkJ2Ylkuf3mUU0QwMcoIX
AWS_REGION=$3 #us-east-1
AWS_REPO_URI=$4 #768297865248.dkr.ecr.us-east-1.amazonaws.com/django-template

echo "Configuring AWS console"
aws configure set aws_access_key_id $AWS_KEY
aws configure set aws_secret_access_key $AWS_SECRET
aws configure set default.region $AWS_REGION

echo "Logging docker into AWS console"
eval $( aws ecr get-login --no-include-email  )

echo "Building & pushing Django/Api"
cd api
bash ./build.sh $AWS_REPO_URI

echo "Building & pushing Rabbitmq"
cd ../rabbitmq
bash ./build.sh $AWS_REPO_URI

echo "Building & pushing Celery workers"
cd ../celery
bash ./build.sh $AWS_REPO_URI

echo "Building & pushing Nginx"
cd ../nginx
bash ./build.sh $AWS_REPO_URI

docker push $AWS_REPO_URI


