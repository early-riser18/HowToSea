FROM python:3.10-slim-bookworm as base
ARG WORKDIR=/app
# Build context expected to be root directory
RUN apt-get -y upgrade && apt-get -y update
WORKDIR $WORKDIR
COPY requirements.txt .
RUN pip3 --no-cache-dir install -r requirements.txt

FROM base
COPY app.py gunicorn.conf.py ./
COPY src/ ./src
COPY schema/ ./schema

RUN mkdir -p /var/log/gunicorn && mkdir -p /var/run/gunicorn
CMD gunicorn --config gunicorn.conf.py app:app
