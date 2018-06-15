#!/bin/sh

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

# Start server
if [ "$SERVER_ENV" = "DEV" ] || [ "$SERVER_ENV" = "TEST" ]; then
    echo "Starting Django & Jupyter in development mode"
    python manage.py shell_plus --notebook & python manage.py runserver 0.0.0.0:8000 && fg
else
    echo "Collecting static files"
    python manage.py collectstatic --noinput

    echo "Starting Django in production mode"
    python manage.py runserver 0.0.0.0:8000
fi