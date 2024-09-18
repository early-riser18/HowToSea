#!/bin/bash

# Following script is necessary since .env file is not "sourced" at container launch in current ECS config.
if [ -f /.env ]; then
  export $(grep -v '^#' /.env | xargs)
fi

envsubst '$DNS_ADDRESS,$LOCATION_HOSTNAME,$LAMBDA_API_URL,$AUTH_HOSTNAME' < /etc/nginx/conf.d/default.template > /etc/nginx/nginx.conf

if [[ $DEBUG == "1" ]]; then
    exec nginx-debug -g 'daemon off;'
else 
    exec nginx -g 'daemon off;'
fi