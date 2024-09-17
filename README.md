# Introduction

_This project is both a portfolio project and an app intended for real user._

How To Sea is a collaborative website to find and share about diving spots around the world. Users post their own spots and can browse through a user-generated catalog of spots.

**Check it out at** [how-to-sea.xyz](https://how-to-sea.xyz/)

## Technical introduction

This project is made of a Single-Page Application built with Next.js for the Front-End, and of a Back-End comprised of multiple scalale micro-services placed behind a NGINX reverse-proxy.

One important technical requirement of this project is to make it scalable to a high load of requests (i.e. able to sustain high user activity).
In the near future, a program will be written to simulate such high activity.

To simplify the discovery of this portfolio project, all services are placed at the root of this repository in an individual folder (vs. a multi-repo strategy).
The components are as follows:

- Web Application at `./webapp`
- Reverse Proxy at `./nginx`
- Location Service at `./location`

# Run locally

We use Docker and Next.js development server to run the services locally

```bash
# Web App
cd webapp && npm run dev

# Backend
source ./.env.local
docker-compose up
```

The source code is loaded to the containers as volumes for development only.

## Lambda function

Small helper functions are run via Amazon Lambda for simplicity
eg: turn on / off services

to run lambda locally for the first time, follow this guide
https://docs.aws.amazon.com/lambda/latest/dg/python-image.html

Start the function

```bash
docker run --platform <your-platform> -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
    --entrypoint /aws-lambda/aws-lambda-rie \
    <image>:<tag> \
        /usr/local/bin/python -m awslambdaric <file>.<function_name>
```

LambdaRIC does not create an entire request object, like the lambda URL would. Therefore, to test Lambda locally, you need to simulate the request object passed to the Lambda function by the server receiving the request.

Structure is like

```json
{
  "queryStringParameters": {
    "key": "value"
  },
  "requestContext": {
    "http": {
      "method": "GET",
      "path": "/..."
    }
  },
  "body": "<string>"
}
```

```bash
#with LambdaRIC
curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" \
    -d '{
    "queryStringParameters": {...},
    "requestContext": {...},
    "body": "",
     }'
```

# Deployment

## Backend services

Each service is run in a container on ECS. For now, deployment code is run locally.

1. Ensure you are authenticated to AWS
2. Run "deploy to ECR scripts" for each microservice

```bash
# from ./
cd nginx && ./push_image_to_prod.sh
cd location && ./push_image_to_prod.sh
```

3. Restart each services in ECS so the latest image is pulled

## Web App

The app is automatically rebuilt and deployed by Vercel when a new commit is made to `prod`.

## Lambda
To do.


## Auth0
- Create a tenant and an application in Auth0.
- Add required values to the provider "auth0" in the Terraform file.
- Follow the [Auth0 quickstart guide](https://auth0.com/docs/quickstart/webapp/python/interactive).
- Create a database connection for user creation requests.
- Set up a management connection with Access Token and Password client credentials as the grant type and linking it to the API. Refer to [Auth0 client credentials flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow/call-your-api-using-the-client-credentials-flow).
- For Google OAuth, register the application following [Google's guide](https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1).