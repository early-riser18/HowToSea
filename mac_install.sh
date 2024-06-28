#!/usr/bin/env bash
# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail
set -Eeuo pipefail

### DEPENDENCIES ###
echo "Checking for docker..." && (docker --version && docker ps) || (echo "If you have docker installed, please start it now and press ENTER" && read -r; docker --version && docker ps || (echo "Installing docker..." && brew install --cask docker && open /Applications/Docker.app))
echo "Checking for docker-compose..." && docker-compose --version || (echo "Installing docker-compose..." && brew install docker-compose)


## DEV ##
docker network create how-to-sea || (docker network rm how-to-sea && docker network create how-to-sea )

# Setup nginx ssl certif locally
bash ./nginx/setup_local.sh