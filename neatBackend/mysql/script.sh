#!/bin/bash

mysql -u root -h localhost -e 'CREATE DATABASE IF NOT EXISTS neatdb;'
mysql -u root -h localhost -e "CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';"
mysql -u root -h localhost -e "CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin';"
mysql -u root -h localhost -e "GRANT ALL ON *.* TO 'admin'@'%';"
mysql -u root -h localhost -e "GRANT ALL ON *.* TO 'admin'@'localhost';"


