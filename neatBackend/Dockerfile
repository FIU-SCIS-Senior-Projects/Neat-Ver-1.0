FROM python:3.5

ENV PYTHONUNBUFFERED 1
MAINTAINER Pachev Joseph

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Requirements.txt /usr/src/app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r Requirements.txt

COPY . /usr/src/app

EXPOSE 8000
ENTRYPOINT ["/bin/bash", "docker-entrypoint.sh"]
