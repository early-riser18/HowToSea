# Introduction

_This project is both a portfolio project and an app intended for real user._

How To Sea is a collaborative website to find and share about diving spots around the world. Users post their own spots and can browse through a user-generated catalog of spots.

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
