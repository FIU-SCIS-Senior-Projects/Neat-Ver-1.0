#!/bin/bash

# Give time for the DB to start
sleep 10

python manage.py makemigrations djangoBackend  # making the migrations
python manage.py migrate                  # Apply database migrations
python manage.py collectstatic --noinput  # Collect static files

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn djangoBackend.wsgi:application \
    --name neatbackend \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --log-level=info \
    "$@"
