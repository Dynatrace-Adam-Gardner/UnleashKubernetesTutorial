# Unleash Feature Flag Tutorial

How can we protect our applications from unexpected errors and load spikes by using feature flags to offload traffic to CDNs during errors.

Application is running in production and suddenly an error occurs. The app should include a circuit breaker to instead serve page from the CDN.

----

This tutorial will run 4x containers on your VM. You'll need the OneAgent deployed on this VM first.

1. An nginx reverse proxy to access app on port `80` (`http://127.0.0.1`)
1. An unleash feature flag container (`http://127.0.0.1/unleash`)
1. The app container (Accessed via reverse proxy on port `80`)
1. A PostGRES Database container

If the feature flag is `disabled` the app will serve `index.html` from within the container.
If the feature flag is `enabled` the app will serve a page hosted on GitHub (`https://raw.githubusercontent.com/agardnerIT/OddFiles/master/index2.html`)

## Deploy the OneAgent
Deploy the OneAgent on your VM.

## Create New Docker Network
This allows containers to talk to each other via their container name.

```
docker network create agardner-net
```

## Clone This Repo
```
sudo apt update && sudo apt install git -y
git clone https://github.com/agardnerit/unleashtutorial
cd unleashtutorial && chmod +x loadGenErrors.sh
```

## Run a PostGresDB for Unleash
```
docker run -d --name postgres --network agardner-net -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=unleash postgres
```
Database = `unleash`
Username = `postgres`
Password = `mysecretpassword`

## Build & Run the Unleash Container
```
docker build -t unleash unleash. && docker run -d --name unleash --network agardner-net -e DATABASE_URL=postgres://postgres:mysecretpassword@postgres:5432/unleash unleashorg/unleash-server
```

Navigate to `http://127.0.0.1/unleash` to validate that Unleash is running.

## Build and Run the App
This app has a feature flag coded into it called `EnableStaticContent`.

```
docker build -t app . && docker run -d --name app --network agardner-net app
```

## Build and Run the NGINX Reverse Proxy
```
docker build -t proxy ./proxy && docker run -d -p 80:80 --name proxy --network agardner-net -e DT_CUSTOM_PROP="keptn_project=website keptn_service=front-end keptn_stage=production" proxy
```

## Test The Application
- The Unleash UI should now be available on `http://127.0.0.1/unleash`
- The app should now be available on `http://127.0.0.1`

## Create Feature Flag
- Go to `http://127.0.0.1/unleash` and login (use a fake email - anything you like)
- Create a feature flag called `EnableStaticContent` (case sensitive and must be called this).
- Set the flag to `disabled`

## Manually Test Flag
Prove that the feature flag works:

- Go to the app (`http://127.0.0.1`) and refresh the page. Nothing happens.
- Enable the feature flag and refresh the app. You'll see a green banner that says the page is served from GitHub.


## Cleanup
To remove everything installed / configured for this demo:
```
docker stop proxy app unleash postgres
docker rm proxy app unleash postgres
docker rmi proxy app unleash postgres
docker network rm agardner-net
```
