# Guía del instructor · Módulo 7

## Objetivo
Desplegar una aplicación con estado y comparar controladores: Pod, PV/PVC, StatefulSet, DaemonSet, Deployment y HPA.

> Supuesto: laboratorio local con un cluster de un nodo y `metrics-server` disponible.

## Archivos
- `manifests/namespace.yaml`
- `manifests/manual-pod.yaml`
- `manifests/pod-sidecar.yaml`
- `manifests/pod-init-container.yaml`
- `manifests/mysql-storage.yaml`
- `manifests/mysql-statefulset.yaml`
- `manifests/fluentd-daemonset.yaml`
- `manifests/web-hpa.yaml`
- `manifests/load-generator.yaml`

## Secuencia rápida

### 1. Namespace
kubectl apply -f manifests/namespace.yaml
kubectl get ns modulo-07-guiado
Explicar: aislar recursos del ejercicio.

### 2. Pod manual
kubectl apply -f manifests/manual-pod.yaml
kubectl get pods -n modulo-07-guiado
kubectl describe pod web-manual -n modulo-07-guiado
Explicar: un Pod suelto no se recrea si lo borramos.

### 3. Pod con sidecar (multi-container)
kubectl apply -f manifests/pod-sidecar.yaml
kubectl get pod web-con-sidecar -n modulo-07-guiado
kubectl describe pod web-con-sidecar -n modulo-07-guiado
**Generar tráfico y ver logs del sidecar:**
kubectl exec -n modulo-07-guiado web-con-sidecar -c web -- curl -s localhost
kubectl logs -n modulo-07-guiado web-con-sidecar -c log-exporter
**Explicar:**
- Dos contenedores en el mismo pod comparten red (localhost) y volúmenes.
- El sidecar `log-exporter` lee logs que genera `web` via volumen compartido (`emptyDir`).
- Patrón común: logging, proxies, adaptadores de métricas.
- `-c` especifica qué contenedor dentro del pod.

### 4. Pod con init container
kubectl apply -f manifests/pod-init-container.yaml
kubectl get pod web-con-init -n modulo-07-guiado
kubectl describe pod web-con-init -n modulo-07-guiado
**Verificar que el init container preparó el contenido:**
kubectl exec -n modulo-07-guiado web-con-init -c web -- cat /usr/share/nginx/html/index.html
**Explicar:**
- Los init containers se ejecutan ANTES del contenedor principal y deben terminar con éxito.
- Se usan para: descargar configuración, esperar a que un servicio esté listo, migrar base de datos.
- Si el init container falla, Kubernetes reintenta hasta que funcione (o aplica backoff).
- En `describe` se ve el estado separado de initContainers vs containers.

### 5. PV y PVC
kubectl apply -f manifests/mysql-storage.yaml
kubectl get pv
kubectl get pvc -n modulo-07-guiado
kubectl describe pvc mysql-pvc -n modulo-07-guiado
Explicar: `hostPath` solo para laboratorio. `PV` ofrece almacenamiento, `PVC` lo reclama.

### 6. MySQL con StatefulSet
kubectl apply -f manifests/mysql-statefulset.yaml
kubectl get statefulset,pods,svc -n modulo-07-guiado
kubectl rollout status statefulset/mysql -n modulo-07-guiado
Explicar: identidad estable (`mysql-0`) y volumen persistente.

### 7. Insertar dato y comprobar persistencia
kubectl exec -n modulo-07-guiado mysql-0 -- \
  mysql -uroot -pformacion123 -e "CREATE DATABASE IF NOT EXISTS curso; USE curso; CREATE TABLE IF NOT EXISTS alumnos (id INT PRIMARY KEY, nombre VARCHAR(50)); INSERT INTO alumnos VALUES (1,'ana') ON DUPLICATE KEY UPDATE nombre='ana'; SELECT * FROM alumnos;"

kubectl delete pod mysql-0 -n modulo-07-guiado
kubectl get pods -n modulo-07-guiado -w

kubectl exec -n modulo-07-guiado mysql-0 -- \
  mysql -uroot -pformacion123 -e "USE curso; SELECT * FROM alumnos;"
Resultado esperado: el registro sigue existiendo tras recrear el pod.

### 8. DaemonSet de Fluentd
kubectl apply -f manifests/fluentd-daemonset.yaml
kubectl get daemonset,pods -n modulo-07-guiado -o wide
kubectl describe daemonset fluentd -n modulo-07-guiado
Explicar: un pod por nodo para tareas de logging.

### 9. Deployment + Service + HPA
kubectl apply -f manifests/web-hpa.yaml
kubectl get deployment,svc,hpa -n modulo-07-guiado
kubectl rollout status deployment/web-hpa -n modulo-07-guiado
Explicar: Deployment para apps stateless; HPA escala según CPU.

### 10. Generar carga y ver escalado
kubectl apply -f manifests/load-generator.yaml
kubectl get hpa -n modulo-07-guiado -w
kubectl get pods -n modulo-07-guiado -l app=web-hpa -w
Resultado esperado: suben las réplicas hasta acercarse a `maxReplicas: 5`.

### 11. Limpieza
kubectl delete -f manifests/load-generator.yaml --ignore-not-found
kubectl delete -f manifests/web-hpa.yaml --ignore-not-found
kubectl delete -f manifests/fluentd-daemonset.yaml --ignore-not-found
kubectl delete -f manifests/mysql-statefulset.yaml --ignore-not-found
kubectl delete -f manifests/mysql-storage.yaml --ignore-not-found
kubectl delete -f manifests/pod-sidecar.yaml --ignore-not-found
kubectl delete -f manifests/pod-init-container.yaml --ignore-not-found
kubectl delete -f manifests/manual-pod.yaml --ignore-not-found
kubectl delete -f manifests/namespace.yaml --ignore-not-found

## Puntos para remarcar
- Pod manual: útil para pruebas, no para producción.
- Multi-container (sidecar): contenedores que colaboran compartiendo red y volúmenes.
- Init containers: preparación previa garantizada antes de arrancar la app.
- PV/PVC: desacoplan almacenamiento de la app.
- StatefulSet: nombre estable y persistencia por pod.
- DaemonSet: ideal para agentes por nodo.
- Deployment + HPA: patrón típico para frontends/APIs.
- Si HPA muestra `<unknown>`, revisar `metrics-server`.
