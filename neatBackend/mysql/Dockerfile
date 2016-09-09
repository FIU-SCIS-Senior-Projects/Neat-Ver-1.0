# Set nginx base image
FROM mysql:latest

# File Author / Maintainer
MAINTAINER Pachev Joseph

# Copy custom configuration file from the current directory
COPY ./conf.d/mysql.cnf /etc/mysql/conf.d/mysql.cnf
COPY ./initdb.d/user.sql /docker-entrypoint-initdb.d/user.sql
