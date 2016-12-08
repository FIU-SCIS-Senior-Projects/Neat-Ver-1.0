#!/bin/sh

mysql -uroot -e "drop database neatdb; create database neatdb;"
python manage.py makemigrations
python manage.py migrate