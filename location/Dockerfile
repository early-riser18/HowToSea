FROM python:3.11-slim-bookworm AS base

RUN apt-get -y upgrade && apt-get -y update

ARG WORKDIR=/app
ARG ENV_FILE=.env
WORKDIR $WORKDIR

COPY requirements.txt .
RUN pip3 --no-cache-dir install -r requirements.txt

COPY app.py gunicorn.conf.py ./
COPY src/ ./src
COPY schema/ ./schema
COPY $ENV_FILE ./.env

RUN mkdir -p /var/log/gunicorn && mkdir -p /var/run/gunicorn
CMD gunicorn --config gunicorn.conf.py app:app
