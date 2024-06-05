FROM python:3.10-bookworm as base
# Build context expected to be root directory
ARG workdir=location
RUN apt-get -y upgrade && apt-get -y update
RUN mkdir /${workdir}
WORKDIR /${workdir}
COPY requirements.txt .
RUN pip3 --no-cache-dir install -r requirements.txt

FROM base
# COPY ./location /${workdir}
RUN mkdir -p /var/log/gunicorn && mkdir -p /var/run/gunicorn
CMD gunicorn --config gunicorn.conf.py routes:app
