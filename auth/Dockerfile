FROM python:3.10-slim-bookworm AS base
ARG WORKDIR=/app
# Build context expected to be root directory
RUN apt-get -y upgrade && apt-get -y update
WORKDIR $WORKDIR
COPY requirements.txt .
RUN pip3 --no-cache-dir install -r requirements.txt

FROM base

ARG ENV_FILE=.env
COPY $ENV_FILE ./.env

COPY app.py gunicorn.conf.py start.sh ./
COPY src/ ./src
COPY grpc_server/ ./grpc_server

RUN chmod +x start.sh
RUN mkdir -p /var/log/gunicorn && mkdir -p /var/run/gunicorn
CMD ./start.sh
