ARG RUNTIME_VERSION="3.10"
ARG WORKDIR="/app/"

FROM python:${RUNTIME_VERSION}-buster as python-buster
ARG WORKDIR
WORKDIR ${WORKDIR}
RUN apt-get update -y && apt-get upgrade -y 

RUN pip3 install --no-cache-dir boto3~=1.3
RUN pip3 --no-cache-dir install awslambdaric --target .

FROM python-buster
ARG WORKDIR
WORKDIR ${WORKDIR}
COPY . ${WORKDIR}

ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie /usr/bin/aws-lambda-rie
COPY entry.sh /
RUN chmod 755 /usr/bin/aws-lambda-rie /entry.sh
ENTRYPOINT [ "/entry.sh" ]
CMD ["main.lambda_handler"]