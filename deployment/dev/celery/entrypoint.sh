#!/bin/sh

# Start server
echo "Starting celery services"
celery flower -A config.celery --port=5555 & celery -A config.celery beat -l warning & celery worker -A config.celery -l warning && fg