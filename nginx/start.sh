#!/bin/bash

# You can add any number of variables below

envsubst '$DNS_ADDRESS,$LOCATION_HOSTNAME,$LAMBDA_API_URL,$AUTH_HOSTNAME' < /etc/nginx/conf.d/default.template > /etc/nginx/nginx.conf

if [[ $ENV == "local" ]]; then
    exec nginx-debug -g 'daemon off;'
else 
    exec nginx -g 'daemon off;'
fi