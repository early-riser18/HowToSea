#!/bin/bash

# Ensure the directory exists
mkdir -p mock_letsencrypt/live/api.how-to-sea.xyz

# Generate a private key
openssl genpkey -algorithm RSA -out mock_letsencrypt/live/api.how-to-sea.xyz/privkey.pem

# Generate a CSR using the private key
openssl req -new -key mock_letsencrypt/live/api.how-to-sea.xyz/privkey.pem -out mock_letsencrypt/live/api.how-to-sea.xyz/fullchain.csr -subj "/C=US/ST=California/L=San Francisco/O=My Company/OU=Org/CN=example.com"

# Generate a self-signed certificate using the CSR and private key
openssl x509 -req -days 365 -in mock_letsencrypt/live/api.how-to-sea.xyz/fullchain.csr -signkey mock_letsencrypt/live/api.how-to-sea.xyz/privkey.pem -out mock_letsencrypt/live/api.how-to-sea.xyz/fullchain.pem

# Generate a Diffie-Hellman parameter
openssl dhparam -out mock_letsencrypt/ssl-dhparams.pem 2048

# Create the options-ssl-nginx.conf file
cat <<EOL > mock_letsencrypt/options-ssl-nginx.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
EOL
