# Unleash Feature Flag Tutorial

How can we protect our applications from unexpected errors and load spikes by using feature flags to offload traffic to CDNs during errors.

Application is running in production and suddenly an error occurs. The app should include a circuit breaker to instead serve page from the CDN.

----

This tutorial will run 4x containers on your localhost.

1. An nginx reverse proxy to access flask app on port `80` (`http://127.0.0.1`)
1. An unleash feature flag container (`http://127.0.0.1:4242`)
1. A flask webserver app (Accessed via reverse proxy on port `80`)
1. A PostGRES Database container

If the feature flag is `disabled` the flask app will serve `index.html` from within the container.
If the feature flag is `enabled` the flask app will serve a page hosted on GitHub (`https://raw.githubusercontent.com/agardnerIT/OddFiles/master/index2.html`)

## Create New Docker Network
This allows containers to talk to each other via their container name.

```
docker network create my-net
```

## Clone This Repo
```
sudo apt update && sudo apt install git -y
git clone https://github.com/agardnerit/unleashtutorial
cd unleashtutorial
```

## Run a PostGresDB for Unleash
```
docker run -d --name postgres --network my-net -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=unleash postgres
```
Database = `unleash`
Username = `postgres`
Password = `mysecretpassword`

Runs on `5432`

## Run the Unleash Container
```
docker run -d -p 4242:4242 --name unleash --network my-net -e DATABASE_URL=postgres://postgres:mysecretpassword@postgres:5432/unleash unleashorg/unleash-server
```
Runs on `4242`

Navigate to `http://127.0.0.1:4242` to validate that Unleash is running.

## Build and Run the Flask App
This flask app has a feature flag coded into it called `EnableStaticContent`.

```
docker build -t flask-app . && docker run -d --name flask-app --network my-net flask-app
```

## Build and Run the NGINX Reverse Proxy
```
docker build -t reverse-proxy ./proxy && docker run -d -p 80:80 --name reverse-proxy --network my-net -e keptn_project=website -e keptn_service=front-end -e keptn_stage=production reverse-proxy
```

## Test The Application
- Unleash should now be available on `http://127.0.0.1:4242`
- The flask app should now be available on `http://127.0.0.1`
