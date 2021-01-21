# Unleash Feature Flag Tutorial

Note: This is a work in progress and should not be used for production or demo scenarios yet.

## Create a GCP Cluster

On cloudshell:
```
cd ~
git clone https://github.com/Dynatrace-Adam-Gardner/UnleashKubernetesTutorial

# Create a cluster
chmod +x ~/createCluster.sh
GOOGLE_PROJECT=*** CLUSTER_NAME=*** ./createCluster.sh 
```

## Deploy Unleash and Demo App
```
kubectl apply -f ~/UnleashKubernetesTutorial/namespace.yaml

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgres bitnami/postgresql -f ~/UnleashKubernetesTutorial/postgresvalues.yaml -n demo

kubectl apply -f ~/UnleashKubernetesTutorial/unleash.yaml -n demo
kubectl apply -f ~/UnleashKubernetesTutorial/demoapp.yaml -n demo

kubectl get services -n demo
```

## Building the App
```
cd ~/UnleashKubernetesTutorial/nodeapp
docker build -t adamgardnerdt/unleashdemoapp:v1 . && docker push adamgardnerdt/unleashdemoapp:v1
```