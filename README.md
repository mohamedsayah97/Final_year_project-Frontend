Prometheus (métriques)
http://localhost:9091
Grafana (visualisation)
http://localhost:3003

Identifiants : admin / admin

k8s :

# 1. Build de l'image Docker (à faire à la racine du projet)

docker build -t react-app:latest .

# 2. Charger l'image dans Kubernetes

docker save react-app:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -

# 3. Déployer

kubectl apply -f k8s/deployment.yaml

# 4. Vérifier que le pod tourne

kubectl get pods

# 5. Vérifier le service

kubectl get services

# Terminal 1 (gardez ouvert)

kubectl port-forward service/react-app-service 30002:5173
