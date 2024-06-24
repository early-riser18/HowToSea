#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

#Check if script is run from root
if [ -z $(echo $PWD | grep '/lambda$') ]; then
    echo "This script must be run from repository's root dir."
    exit 1
fi

IMG_NAME=lambda_api
REPO_ROOT=211125707335.dkr.ecr.ap-northeast-1.amazonaws.com
REPO_NAME=how-to-sea-prod
LOCAL_ARCH=linux/arm64
CLOUD_ARCH=linux/amd64

build_image() {
    # Dockerfile expected in 
    echo "Building image: $IMG_NAME:$TAG for $SYS_ARCH" 
    docker build --platform $SYS_ARCH -t $IMG_NAME:$TAG -f ${PWD}/Dockerfile ${PWD}

}

SYS_ARCH=$CLOUD_ARCH
TAG=latest
build_image
echo "Pushing to repo $REPO_ROOT/$REPO_NAME as $IMG_NAME-$TAG" 
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $REPO_ROOT
docker tag $IMG_NAME:$TAG $REPO_ROOT/$REPO_NAME:$IMG_NAME-$TAG
docker push $REPO_ROOT/$REPO_NAME:$IMG_NAME-$TAG

aws lambda update-function-code \
--function-name lambda-api \
--image-uri 211125707335.dkr.ecr.ap-northeast-1.amazonaws.com/how-to-sea-prod:lambda_api-latest 
