# Unleash Feature Flag Tutorial

```
cd ~
git clone https://github.com/Dynatrace-Adam-Gardner/UnleashKubernetesTutorial


kubectl apply -f ~/UnleashKubernetesTutorial/namespace.yaml

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgres bitnami/postgresql -f ~/UnleashKubernetesTutorial/postgresvalues.yaml -n demo

kubectl apply -f ~/UnleashKubernetesTutorial/unleash.yaml -n demo

kubectl apply -f ~/UnleashKubernetesTutorial/demoapp.yaml -n demo

kubectl get services -n demo
```