# Ejercicio 4: Headlamp — Dashboard moderno para Kubernetes

## Escenario

Quieres una alternativa moderna y ligera al Kubernetes Dashboard clásico. Headlamp es un UI open-source que se despliega dentro del clúster y ofrece una interfaz gráfica completa para gestionar recursos. En este ejercicio desplegarás Headlamp en un clúster Kind y lo expondrás con Ingress NGINX para acceder desde `http://localhost`.

## Objetivos

- Crear un clúster Kind preparado para Ingress
- Instalar el Ingress Controller NGINX
- Desplegar Headlamp en su propio namespace
- Exponer Headlamp con un recurso Ingress accesible desde `http://localhost`
- Autenticarse con un token de ServiceAccount

## Requisitos previos

- Docker en ejecución
- `kubectl` instalado
- `kind` instalado
- Navegador web

## Archivos del ejercicio

- `manifests/kind-cluster.yaml` — Configuración del clúster Kind con puertos para Ingress
- `manifests/headlamp-admin.yaml` — ServiceAccount, ClusterRoleBinding y Secret
- `manifests/headlamp-deployment.yaml` — Deployment y Service de Headlamp
- `manifests/headlamp-ingress.yaml` — Ingress para acceso por `http://localhost`

---

## Tareas

### Tarea 1: Crear el clúster Kind

kind create cluster --name m3-headlamp --config manifests/kind-cluster.yaml

Verifica:

kubectl get nodes

### Tarea 2: Instalar el Ingress Controller NGINX

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

> **Nota:** El controller debe ejecutarse en el control-plane (donde están los puertos 80/443 mapeados). Si se programa en un worker, parchea:
> kubectl -n ingress-nginx patch deployment ingress-nginx-controller \
>   --type='json' \
>   -p='[{"op": "add", "path": "/spec/template/spec/nodeSelector/ingress-ready", "value": "true"}]'

Espera a que esté listo:

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=180s

### Tarea 3: Crear el namespace y desplegar Headlamp

Crea el namespace:

kubectl create namespace headlamp

Aplica los manifests en orden:

kubectl apply -f manifests/headlamp-admin.yaml
kubectl apply -f manifests/headlamp-deployment.yaml
kubectl apply -f manifests/headlamp-ingress.yaml

Espera a que el pod esté listo:

kubectl get pods -n headlamp --watch

> Pulsa `Ctrl+C` cuando el pod esté `Running` con `1/1 READY`.

### Tarea 4: Obtener el token de acceso

kubectl get secret headlamp-admin-token -n headlamp -o jsonpath='{.data.token}' | base64 -d

> Copia el token. Lo necesitarás para autenticarte en Headlamp.

### Tarea 5: Acceder a Headlamp desde el navegador

Abre en el navegador (usa una **pestaña de incógnito** si has accedido antes a otros servicios en localhost):

http://localhost

- Pega el token obtenido en la Tarea 4
- Explora los recursos del clúster: nodos, pods, namespaces, deployments...

> **Troubleshooting:** Si el navegador redirige automáticamente a HTTPS o muestra "error authenticating":
> - Abre una pestaña de incógnito/privada
> - O limpia la caché HSTS de `localhost` (en Chrome: `chrome://net-internals/#hsts` → Delete domain `localhost`)
> - Asegúrate de usar `http://` (no `https://`)

### Tarea 6: Limpiar el entorno

kind delete cluster --name m3-headlamp

---

## Verificación

- [ ] El clúster Kind se crea con 3 nodos (1 control-plane + 2 workers)
- [ ] El Ingress Controller está corriendo en el control-plane
- [ ] El pod de Headlamp está en estado `Running`
- [ ] Se puede acceder a `http://localhost` y ver la pantalla de login
- [ ] El token permite autenticarse y navegar los recursos del clúster

## Entregables

- Salida de `kubectl get pods -n headlamp`
- Salida de `kubectl get ingress -n headlamp`
- Captura de pantalla de Headlamp mostrando los nodos del clúster
