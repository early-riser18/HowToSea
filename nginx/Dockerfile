FROM nginx:1.27.0-perl

RUN apt update
ARG ENV_FILE=.env

COPY nginx.conf /etc/nginx/conf.d/default.template
COPY start.sh /
COPY $ENV_FILE /.env
RUN chmod +x start.sh

CMD ["/start.sh"]

