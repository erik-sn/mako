#!/bin/sh

echo "Waiting for database to spin up"
sleep 5

echo "Apply database migrations"
python manage.py migrate

# Start server
if [ "$SERVER_ENV" = "DEV" ] || [ "$SERVER_ENV" = "TEST" ]; then
    echo "Starting server"
    python manage.py runserver 0.0.0.0:8000
else
    echo "Collecting static files"
    python manage.py collectstatic --noinput

    echo "Starting Django in production mode"
    python manage.py runserver 0.0.0.0:8000
fi
