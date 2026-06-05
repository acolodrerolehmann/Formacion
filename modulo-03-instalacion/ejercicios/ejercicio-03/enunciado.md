# Ejercicio 3: Clúster Kind con Ingress y Kubernetes Dashboard

## Escenario

Tu equipo necesita un entorno local de Kubernetes accesible desde el navegador para visualizar y gestionar recursos de forma gráfica. Debes crear un clúster Kind con un Ingress Controller y exponer el Kubernetes Dashboard a través de un Ingress, accesible desde tu máquina local.

## Objetivos

- Crear un clúster Kind preparado para Ingress (puertos 80/443 mapeados al host)
- Instalar un Ingress Controller (NGINX)
- Instalar el Kubernetes Dashboard
- Configurar un recurso Ingress para acceder al Dashboard desde el navegador
- Crear un usuario administrador con permisos para operar el Dashboard

## Requisitos previos

- Docker en ejecución
- `kubectl` instalado
- `kind` instalado
- Navegador web
- Acceso a Internet

## Archivos del ejercicio

- `manifests/kind-dashboard-cluster.yaml` — Configuración del clúster Kind con Ingress
- `manifests/dashboard-admin-user.yaml` — ServiceAccount y permisos de admin
- `manifests/dashboard-ingress.yaml` — Recurso Ingress para exponer el Dashboard (vía `dashboard.local`)
- `manifests/dashboard-ingress-localhost.yaml` — Recurso Ingress para acceso directo vía `https://localhost`

---

## Tareas

### Tarea 1: Crear el clúster Kind preparado para Ingress

El archivo `kind-dashboard-cluster.yaml` configura un clúster con los puertos 80 y 443 del host mapeados al control-plane, y una etiqueta `ingress-ready=true` necesaria para el controlador NGINX.

kind create cluster --name m3-dashboard --config manifests/kind-dashboard-cluster.yaml

Verifica que el clúster está operativo:

kubectl cluster-info --context kind-m3-dashboard
kubectl get nodes

### Tarea 2: Instalar el Ingress Controller NGINX

Aplica el manifiesto oficial de ingress-nginx para Kind:

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

> **Nota:** El Ingress Controller debe ejecutarse en el nodo `control-plane` (donde están mapeados los puertos 80/443). Si el pod se programa en un worker, parchea el deployment:
>
> kubectl -n ingress-nginx patch deployment ingress-nginx-controller \
>   --type='json' \
>   -p='[{"op": "add", "path": "/spec/template/spec/nodeSelector", "value": {"ingress-ready": "true"}}]'

Espera a que el controlador esté listo (la primera vez puede tardar ~2 minutos descargando la imagen):

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=180s

Verifica que el pod del Ingress Controller está corriendo **en el nodo control-plane**:

kubectl get pods -n ingress-nginx -o wide

### Tarea 3: Instalar el Kubernetes Dashboard

Aplica el manifiesto oficial del Dashboard:

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

> **Importante:** Este comando crea el namespace `kubernetes-dashboard` y todos los recursos del Dashboard. Las tareas siguientes dependen de que este paso se complete con éxito.

Espera a que los pods del Dashboard estén listos:

kubectl get pods -n kubernetes-dashboard --watch

> Pulsa `Ctrl+C` cuando todos los pods estén `Running`.

### Tarea 4: Crear usuario administrador

> Requiere que la Tarea 3 haya finalizado (el namespace `kubernetes-dashboard` debe existir).

Aplica el manifiesto que crea la ServiceAccount y el ClusterRoleBinding:

kubectl apply -f manifests/dashboard-admin-user.yaml

### Tarea 5: Configurar el Ingress para el Dashboard

> Requiere que la Tarea 3 haya finalizado (el namespace `kubernetes-dashboard` debe existir).

Aplica los recursos Ingress. Tienes dos opciones (puedes usar ambas):

**Opción A — Acceso directo por `https://localhost`** (sin configuración extra):

kubectl apply -f manifests/dashboard-ingress-localhost.yaml

**Opción B — Acceso por nombre de host `https://dashboard.local`:**

kubectl apply -f manifests/dashboard-ingress.yaml

> Para la Opción B necesitas añadir la entrada en `/etc/hosts`:
> echo "127.0.0.1 dashboard.local" | sudo tee -a /etc/hosts

Verifica que el Ingress se ha creado correctamente:

kubectl get ingress -n kubernetes-dashboard

### Tarea 6: Obtener el token y acceder al Dashboard

Genera un token temporal:

kubectl -n kubernetes-dashboard create token admin-user

Abre en el navegador:

https://localhost

O si configuraste `/etc/hosts`:

https://dashboard.local

> El navegador mostrará un aviso de certificado autofirmado. Acepta la excepción para continuar.

- Selecciona **Token** como método de autenticación
- Pega el token obtenido
- Explora los namespaces, nodos y pods del clúster

### Tarea 7: Limpiar el entorno

kind delete cluster --name m3-dashboard

Elimina la entrada de `/etc/hosts` si lo deseas:

sudo sed -i '' '/dashboard.local/d' /etc/hosts

---

## Verificación

- [ ] El clúster se crea con los puertos 80 y 443 mapeados al host
- [ ] El Ingress Controller NGINX está corriendo en `ingress-nginx`
- [ ] Los pods del Dashboard están en estado `Running`
- [ ] El recurso Ingress está creado y apunta al servicio del Dashboard
- [ ] Se puede acceder a `https://dashboard.local` desde el navegador
- [ ] El token permite autenticarse y ver los recursos del clúster

## Entregables

- Captura de pantalla del Dashboard mostrando los nodos del clúster
- Salida de `kubectl get ingress -n kubernetes-dashboard`
- Salida de `kubectl get pods -n kubernetes-dashboard`
- Salida de `kubectl get pods -n ingress-nginx`
