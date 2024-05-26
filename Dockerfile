FROM debian:bookworm
#need to add platform specific later

RUN apt update
RUN apt install -y nginx 

CMD nginx -g 'daemon off;'