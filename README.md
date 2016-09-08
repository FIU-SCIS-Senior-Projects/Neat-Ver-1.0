# Neat-Ver-1.0
Neat Ver 1.0

## Installing Backend

### Python Virtual Environment

This project is best ran in a virtual environment. You can use [pyvenv][2],
which comes with python 3 and greater.

#### Installation

First install python3+ on your machine and then download and install [pip][1].
Then from the root of the project run:

1. `pyvenv venv` - Create a virtual environment in the venv folder
2. `source venv/bin/activate` - Load the environment
3. `pip install -r djangoBackend/Requirements.txt` - Install dependencies
4. `deactivate` - Unloads the environment

#### Usage

1. `source venv/bin/activate` - Load the environment
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
[2]: http://dev.mysql.com/doc/refman/5.7/en/installing.html
