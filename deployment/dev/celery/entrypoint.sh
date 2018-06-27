#!/bin/sh

echo "Wait for app to start"
sleep 10

echo "Starting celery services"
flower -A mako.celery --port=5555 & celery -A mako.celery beat -l warning & celery worker -A mako.celery -l warning && fg