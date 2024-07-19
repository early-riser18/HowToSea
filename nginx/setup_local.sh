#!/bin/bash
set -eo pipefail
#### RUN THIS SCRIPT IN NGINX DIR ####

THIS_DIR=$PWD
CA_FOLDER=~/local_ca
DOMAIN=api.how-to-sea.xyz
CA_PW=root

#### CREATE LOCAL CERTIFICATE AUTHORITY ####
mkdir -p $CA_FOLDER
cd $CA_FOLDER

openssl genrsa -des3 -passout pass:$CA_PW -out $CA_FOLDER/myCA.key 2048 
openssl req -x509 -new -nodes -key $CA_FOLDER/myCA.key -sha256 -days 1825 -passin pass:$CA_PW -out $CA_FOLDER/myCA.pem -subj "/C=US/ST=California/L=San Francisco/O=My Company/OU=Org/CN=justinCA/emailAddress=example@gmail.com"
sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" $CA_FOLDER/myCA.pem


#### CREATE LOCAL CERTIFICATE ####
cd $THIS_DIR

# Ensure the directory exists
mkdir -p mock_letsencrypt/live/$DOMAIN

# Generate a private key
openssl genrsa -out mock_letsencrypt/live/$DOMAIN/privkey.pem 2048

# Generate a CSR using the private key
openssl req -new -key mock_letsencrypt/live/$DOMAIN/privkey.pem -out mock_letsencrypt/live/$DOMAIN/fullchain.csr -subj "/C=US/ST=California/L=San Francisco/O=My Company/OU=Org/CN=localhost/emailAddress=example@gmail.com"

# Add ext file to solve NET::ERR_CERT_COMMON_NAME_INVALID. See https://stackoverflow.com/questions/43665243/invalid-self-signed-ssl-cert-subject-alternative-name-missing/43665244#43665244
cat > $DOMAIN.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
EOF

# Generate a self-signed certificate using the CSR and the local Certificate Authority Key
openssl x509 -req -sha256 -days 365 -passin pass:$CA_PW -in mock_letsencrypt/live/$DOMAIN/fullchain.csr -CA ~/certs/myCA.pem -CAkey ~/certs/myCA.key \
 -CAcreateserial -out mock_letsencrypt/live/$DOMAIN/fullchain.pem -extfile $DOMAIN.ext

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
