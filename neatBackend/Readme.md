# Neat Backend

Django and Django REST Framework For Neat

# Rest API Documentation
For an in depth documentation go to [http://localhost/docs][5] or the official docs at [http://52.87.176.128/docs][6]

##Changelog
#####11/20/16

* update initialData.sh

#####11/17/16

* changed modelName, modelID & modelYear to name, identifier & year respectively

#####11/16/16

* Added /api/myClasses/ endpoint to get a list of classes user belongs to
* Switched data to datetime, still inputting only dates to endpoint as 'due' field
* initialData.sh and restartDB.sh scripts

#####11/11/16

* Added /api/startGroup/ endpoint to initialize student group with correct permissions

#####11/10/16

* Collab & dashboard views updated with new algorithm
* Created smart algorithm & added it to /getAssigProgress/#/ view
* Added dueDate, difficulty to Task (note endDate != dueDate, use dueDate)

#####11/08/16

* User creating a school, class, or assignment is automatically added to respective roster
* Added dashboard endpoint
* Added isPublic boolean fields to Class & Assignment

##Endpoint examples

* Look at initialData.sh for endpoint examples with httpie

#Usage

### Python Virtual Machine (Unix)

1. `source venv/bin/activate` - Load the environment, run scripts and develop under environment
2. `deactivate` - Unload the environment when you're done with python

### Python Virtual Machine (Windows)

1. `venv/Scripts/activate` - Load the environment, run scripts and develop under environment
2. `deactivate` - Unload the environment when you're done with python


### Django Quickstart

* `python manage.py createsuperuser` - add yourself to the database as an admin so that you can login to the REST API
* `python manage.py migrate` - apply model changes
* `python manage.py runserver` - run test server default is http://localhost:8000

### Django Useful Commands

* `python manage.py runserver 0.0.0.0:8000` - run test server accessible remotely
* `rm -r restAPI/migrations` - delete database (follow MYSQL procedures as well)
* `python manage.py makemigrations restAPI` - start new database


# Installation

### Python Virtual Environment

This project is best ran in a virtual environment. You can use [pyvenv][2],
which comes with python 3 and greater. The virtual enviroment lets you run
different versions of python and packages from other projects.

#### Installation (Unix)

First install python3+ on your machine and then download and install [pip][1].
Then from the root of the project run:

1. `pyvenv venv` - Create a virtual environment in the venv folder
2. `source venv/bin/activate` - Load the environment
3. `pip install -r neatBackend/Requirements.txt` - Install dependencies
4. `deactivate` - Unloads the environment


#### Installation (Windows)
Note - Most documentation is for unix systems. Differences between windows and unix are: `env\Scripts\` instead of `env/bin/` and libraries go in `env\Lib\` rather than `env/lib/`)

First install python3+ on your machine and then download and install [pip][1].
Then from the root of the project run:

1. `pip install virtualenv` - Install virtualenv if not already done soCreate a virtual environment in the venv folder
2. `virtualenv venv` - This creates will create a series of directories and scripts
3. `venv/Scripts/activate` - Load the enviroment (There should be a (venv) before the current directory path name
4. `pip install -r neatBackend/Requirements.txt` - Install dependencies
5. `deactivate` - Unloads the environment


### Mysql

Download the latest version of [Mysql][3], and follow the instructions for installing
on your system. 


#### Setup

Once it has been installed, you need to start the mysql server and create a database and a 
user:

```
CREATE DATABASE neatdb;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL ON *.* TO 'admin'@'localhost';
exit;
```
#### Deletion

If restarting the database from scratch:

```
DROP DATABASE neatdb;
exit;
```

### Optional- Running with docker

This project can also be ran using docker. Docker is a container system meant
to run an application with the same environment it was built in. This ensures
dependencies remain the same on every system. To get started, install the
docker toolbox with your favorite package manager. vist [docker's website][4] 
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

#### Possible Database error
After the previous step, let the app build in the container and start. Once the app 
has started, if you get a cannot connect error "Host is not allowed", then the database
did not get created correctly(mysql issue). To fix this, I've included a script inside
the container itself. run the command `docker exec -it neatbackend_db_1 bash -l` to enter
the database container(this must be done while the container is running). From that 
point execute the script with the following command `./docker-entrypoint-initdb.d/script.sh` 
and it should create all the files you need. Stop the running instance docker-compose and 
return the commmand `docker-compose up -d --build`.

This wills start the application with all dependencies installed, as well as a
small webserver to serve the static files. You can then reach the running 
application by visiting the ip address of your docker-machine

[1]: https://pip.pypa.io/en/latest/installing/
[2]: https://docs.python.org/3/using/scripts.html
[3]: http://dev.mysql.com/doc/refman/5.7/en/installing.html
[4]: https://www.docker.com/products/docker-toolbox
[5]: http://localhost/docs
[6]: http://52.87.176.128/docs
