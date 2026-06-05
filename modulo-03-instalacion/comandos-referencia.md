# Referencia rápida: Comandos kind y kubectl

## 1. Comandos típicos de `kind`

### Gestión de clústeres

# Crear un clúster con configuración por defecto
kind create cluster

# Crear un clúster con nombre personalizado
kind create cluster --name mi-cluster

# Crear un clúster usando un archivo de configuración
kind create cluster --name mi-cluster --config kind-config.yaml

# Listar clústeres activos
kind get clusters

# Eliminar un clúster por nombre
kind delete cluster --name mi-cluster

# Eliminar todos los clústeres
kind delete clusters --all

### Imágenes y nodos

# Cargar una imagen local en el clúster (evita pull desde registry)
kind load docker-image mi-app:latest --name mi-cluster

# Cargar imagen desde un archivo tar
kind load image-archive mi-app.tar --name mi-cluster

# Listar los nodos (contenedores Docker) del clúster
kind get nodes --name mi-cluster

### Kubeconfig y contexto

# Obtener el kubeconfig de un clúster kind
kind get kubeconfig --name mi-cluster

# Exportar kubeconfig a un archivo
kind get kubeconfig --name mi-cluster > kubeconfig-mi-cluster.yaml

### Logs y diagnóstico

# Exportar logs del clúster a un directorio
kind export logs ./logs-cluster --name mi-cluster

---

## 2. Comandos básicos de `kubectl` tras crear un clúster

### Información general del clúster

# Ver la URL del API Server y componentes principales
kubectl cluster-info

# Versión del cliente y del servidor
kubectl version

# Listar todos los recursos disponibles en la API
kubectl api-resources

### Nodos

# Listar nodos del clúster
kubectl get nodes

# Listar nodos con información extendida (IP, OS, runtime)
kubectl get nodes -o wide

# Ver detalles completos de un nodo
kubectl describe node <nombre-nodo>

# Ver el estado (condiciones) de un nodo
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[-1].type}{"\t"}{.status.conditions[-1].status}{"\n"}{end}'

### Estado del clúster

# Verificar que los componentes del control plane están sanos
kubectl get componentstatuses    # (deprecated en versiones recientes)
kubectl get pods -n kube-system

# Ver eventos recientes del clúster
kubectl get events --all-namespaces --sort-by='.lastTimestamp'

# Ver pods del sistema y su estado
kubectl get pods -n kube-system -o wide

### Namespaces

# Listar todos los namespaces
kubectl get namespaces
kubectl get ns

# Crear un namespace
kubectl create namespace mi-namespace

# Ver recursos en un namespace específico
kubectl get all -n mi-namespace

# Eliminar un namespace (y todo su contenido)
kubectl delete namespace mi-namespace

### Pods

# Listar pods en el namespace actual
kubectl get pods

# Listar pods en todos los namespaces
kubectl get pods --all-namespaces
kubectl get pods -A

# Listar pods con más detalle
kubectl get pods -o wide

# Ver logs de un pod
kubectl logs <nombre-pod>
kubectl logs <nombre-pod> -f          # seguir logs en tiempo real

# Describir un pod (eventos, condiciones, contenedores)
kubectl describe pod <nombre-pod>

# Ejecutar un comando dentro de un pod
kubectl exec -it <nombre-pod> -- /bin/sh

### Cambiar de contexto / proyecto

# Ver todos los contextos configurados (cada clúster kind crea uno)
kubectl config get-contexts

# Ver el contexto activo
kubectl config current-context

# Cambiar al contexto de un clúster kind
kubectl config use-context kind-mi-cluster

# Establecer un namespace por defecto para el contexto actual
kubectl config set-context --current --namespace=mi-namespace

> **Nota:** En Kubernetes vanilla no existe el concepto de "proyecto" como en OpenShift.
> El equivalente más cercano es el **namespace**. Para "cambiar de proyecto" simplemente
> cambia el namespace por defecto de tu contexto o usa `-n <namespace>` en cada comando.

---

## 3. Flujo típico tras crear un clúster con kind

# 1. Crear el clúster
kind create cluster --name m3-kind --config kind-cluster.yaml

# 2. Verificar que el contexto apunta al clúster
kubectl config current-context
# Salida esperada: kind-m3-kind

# 3. Comprobar que los nodos están Ready
kubectl get nodes

# 4. Verificar pods del sistema
kubectl get pods -n kube-system

# 5. Crear un namespace para trabajar
kubectl create namespace desarrollo

# 6. Cambiar al namespace de trabajo
kubectl config set-context --current --namespace=desarrollo

# 7. Desplegar algo de prueba
kubectl run nginx --image=nginx:alpine
kubectl get pods

# 8. Limpiar
kubectl delete pod nginx
kind delete cluster --name m3-kind
