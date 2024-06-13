# FROM debian:bookworm
# #need to add platform specific later

# RUN apt update
# RUN apt install -y nginx 
# COPY nginx.conf /etc/nginx/nginx.conf
# CMD nginx -g 'daemon off;'


FROM nginx:1.13.8

COPY nginx.conf /etc/nginx/conf.d/default.template
COPY start.sh /
RUN chmod +x start.sh

CMD ["/start.sh"]


