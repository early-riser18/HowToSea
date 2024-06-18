FROM nginx:1.13.8

COPY nginx.conf /etc/nginx/conf.d/default.template
COPY start.sh /
RUN chmod +x start.sh

CMD ["/start.sh"]