FROM nginx:1.27.0-perl

RUN apt update
COPY nginx.conf /etc/nginx/conf.d/default.template
COPY start.sh /
RUN chmod +x start.sh

CMD ["/start.sh"]

