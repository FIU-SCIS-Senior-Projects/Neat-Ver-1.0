[![Build Status](http://http://54.161.87.76:8080/job/neat-backend/badge/icon)](http://http://54.161.87.76:8080/job/neat-backend/)

# Neat-Ver-1.0
Neat Ver 1.0

## Installing Backend

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

#### Usage (Unix)

1. `source venv/bin/activate` - Load the environment
2. run all python scripts under environment
3. `deactivate` - Unload the environment when you're done with python

#### Installation (Windows)
Note - Most documentation is for unix systems. Differences between windows and unix are: `env\Scripts\` instead of `env/bin/` and libraries go in `env\Lib\` rather than `env/lib/`)

First install python3+ on your machine and then download and install [pip][1].
Then from the root of the project run:

1. `pip install virtualenv` - Install virtualenv if not already done soCreate a virtual environment in the venv folder
2. `virtualenv venv` - This creates will create a series of directories and scripts
3. `venv/Scripts/activate` - Load the enviroment (There should be a (venv) before the current directory path name
4. `pip install -r neatBackend/Requirements.txt` - Install dependencies
5. `deactivate` - Unloads the environment

#### Usage (Windows)

1. `venv/Scripts/activate` - Load the environment
2. run all python scripts under environment
3. `deactivate` - Unload the environment when you're done with python



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
```
DROP DATABASE neatdb;
exit;
```




[1]: https://pip.pypa.io/en/latest/installing/
[2]: https://docs.python.org/3/using/scripts.html
[3]: http://dev.mysql.com/doc/refman/5.7/en/installing.html
