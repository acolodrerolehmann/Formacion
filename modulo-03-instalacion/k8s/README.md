# Manifiestos Kubernetes — Border & Travel

Manifiestos para desplegar la aplicación Border & Travel en un clúster Kind local.

## Estructura

| Fichero | Descripción |
|---------|-------------|
| `00-kind-cluster.yaml` | Configuración del clúster Kind (1 CP + 3 workers) |
| `01-namespace.yaml` | Namespace `border-travel` |
| `02-configmap.yaml` | ConfigMaps: config de la app + nginx.conf |
| `03-secrets.yaml` | Secrets: credenciales DB, app y Redis |
| `04-postgres.yaml` | Deployment + Service de PostgreSQL |
| `05-redis.yaml` | Deployment + Service de Redis |
| `06-app-deployment.yaml` | Deployment + Service del API backend |
| `07-frontend.yaml` | Deployment + Service del frontend (Nginx proxy) |
| `08-ingress.yaml` | Ingress para enrutar tráfico por host/path |

## Despliegue rápido

# 1. Crear el clúster Kind
kind create cluster --name curso-k8s --config 00-kind-cluster.yaml

# 2. Aplicar todos los manifiestos en orden
kubectl apply -f 01-namespace.yaml
kubectl apply -f 02-configmap.yaml
kubectl apply -f 03-secrets.yaml
kubectl apply -f 04-postgres.yaml
kubectl apply -f 05-redis.yaml
kubectl apply -f 06-app-deployment.yaml
kubectl apply -f 07-frontend.yaml

# 3. (Opcional) Instalar Ingress Controller y aplicar ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
kubectl apply -f 08-ingress.yaml

# 4. Verificar
kubectl get all -n border-travel

## Acceso

- **NodePort:** http://localhost:8080 (frontend vía NodePort 30080)
- **Ingress:** http://border-travel.local (requiere entrada en `/etc/hosts`)

# Añadir a /etc/hosts para usar Ingress
echo "127.0.0.1 border-travel.local" | sudo tee -a /etc/hosts

## Notas sobre Secrets

⚠️ Los secrets en `03-secrets.yaml` son **solo para desarrollo**. En producción:

- Usar [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- Usar [External Secrets Operator](https://external-secrets.io/)
- Usar [HashiCorp Vault](https://www.vaultproject.io/)
- Nunca commitear secretos reales en el repositorio

## Limpieza

kind delete cluster --name curso-k8s
