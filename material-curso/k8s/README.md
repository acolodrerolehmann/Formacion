# Manifiestos Kubernetes — VoyageR

Despliegue de la aplicación VoyageR (Agencia de Viajes) en un clúster Kind.

## Estructura

| Fichero | Descripción |
|---------|-------------|
| `kind-cluster.yaml` | Configuración del clúster Kind (1 CP + 2 workers) |
| `namespace.yaml` | Namespace `voyager` |
| `configmap.yaml` | ConfigMaps: backend env, nginx proxy, init SQL |
| `secret.yaml` | Secrets: credenciales de PostgreSQL |
| `postgres.yaml` | Deployment + Service de PostgreSQL con datos seed |
| `backend.yaml` | Deployment + Service del backend FastAPI |
| `frontend.yaml` | Deployment + Service del frontend (React + Nginx) |
| `ingress.yaml` | Ingress para acceso por dominio |

## Despliegue paso a paso

# 1. Crear el clúster Kind
kind create cluster --name voyager --config k8s/kind-cluster.yaml

# 2. Construir las imágenes y cargarlas en Kind
docker compose build
kind load docker-image material-curso-frontend:latest --name voyager
kind load docker-image material-curso-backend:latest --name voyager

# 3. Aplicar manifiestos en orden
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# 4. Verificar que todo está running
kubectl get all -n voyager

# 5. (Opcional) Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s
kubectl apply -f k8s/ingress.yaml

## Acceso

- **NodePort:** http://localhost:8080
- **Ingress:** http://voyager.local (añadir `127.0.0.1 voyager.local` a `/etc/hosts`)

## Notas

- Las imágenes usan `imagePullPolicy: Never` porque se cargan directamente en Kind con `kind load`
- El ConfigMap `postgres-init` contiene el esquema y datos seed (equivalente al `database/init.sql`)
- Los Secrets son **solo para desarrollo** — en producción usar Sealed Secrets o Vault

## Limpieza

kind delete cluster --name voyager
