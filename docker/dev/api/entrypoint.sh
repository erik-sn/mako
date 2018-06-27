#!/bin/sh

echo "Waiting for database to spin up"
sleep 5

# Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

# Start server
echo "Starting server"
daphne config.asgi:channel_layer --port 8888