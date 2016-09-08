# Neat Backend

Django  and Django REST Framework For Neat

## Quickstart

* `python manage.py createsuperuser` - add yourself to the database as an admin so that you can login to the REST API
* `python manage.py migrate` - apply model changes
* `python manage.py runserver` - run test server default is http://localhost:8000

## Commands

Here are some useful commands you might need

* `python manage.py migrate` - apply model changes
* `python manage.py runserver` - run test server
* `python manage.py runserver 0.0.0.0:8000` - run test server accessible remotely
* `rm -r restAPI/migrations` - delete database (follow PSQL procedures as well)
* `python manage.py makemigrations restAPI` - start new database
* `python manage.py createsuperuser` - add yourself to the database as an admin so that you can login to the REST API

## Optional- Running with docker

This project can also be ran using docker. Docker is a container system meant
to run an application with the same environment it was built in. This ensures
dependencies remain the same on every system. To get started, install the
docker toolbox with your favorite package manager. vist [docker's website][1] 
for installation instructions.

To run this using docker, make sure that your docker machine is running if you
are on Mac/Windows. To create a virtualbox using `docker-machine` and then load
it use the following commands:

1. `docker-machine create --driver virtualbox default`
2. `docker-machine start default`
3. `eval $(docker-machine env default)`
3. `docker-machine ls` to get the ip address of your docker-machine

Once the previous commands are done you should have a working VM running and
loaded. Use `docker ps` to get a list of docker containers (should be empty at
this time).

Finally, to start the app:
`docker-compose up -d --build`

This wills start the application with all dependencies installed, as well as a
small webserver to server the static files. You can then reach the running 
application by visiting the ip address of your docker-machine

[1]: https://www.docker.com/products/docker-toolbox
