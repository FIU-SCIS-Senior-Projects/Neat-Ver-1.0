# Neat-Ver-1.0
Neat Ver 1.0

## Installing Backend

###Python Virtual Environment

This project is best ran in a virtual environment. You can use [pyvenv][2],
which comes with python 3 and greater.

####Installation

First install python3+ on your machine and then download and install [pip][1].
Then from the root of the project run:

1. `pyvenv venv` - Create a virtual environment in the venv folder
2. `source venv/bin/activate` - Load the environment
3. `pip install -r Requirements.txt` - Install dependencies
4. `deactivate` - Unloads the environment

####Usage

1. `source venv/bin/activate` - Load the environment
2. run all python scripts under environment
3. `deactivate` - Unload the environment when you're done with python

###PostgreSQL

Download the latest version of PostgreSQL, enter the command line with `psql`
####Setup
```
CREATE DATABASE neatdb;
\connect neatdb
CREATE USER admin WITH PASSWORD 'admin' CREATEDB;
\q
```
####Deletion
```
DROP DATABASE neatdb;
\q
```
