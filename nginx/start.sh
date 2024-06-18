#!/bin/bash

# You can add any number of variables below

envsubst '$DNS_ADDRESS,$LOCATION_HOSTNAME,' < /etc/nginx/conf.d/default.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'