#!/bin/bash

# Give time for the DB to start
nginx/wait-for-it.sh -t 50 db:3306

python manage.py makemigrations 
python manage.py migrate                  # Apply database migrations
python manage.py collectstatic --noinput  # Collect static files

# Create a superuser
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn djangoBackend.wsgi:application \
    --name neatbackend \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --log-level=info \
    "$@"
