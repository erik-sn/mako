#!/bin/sh

echo "Wait for app to start"
sleep 10

echo "Starting celery services"
flower -A mako.celery --url_prefix=flower --port=5555 & celery worker -A mako.celery -l warning && fg