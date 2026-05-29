# Módulo 7: Pods, Volúmenes y Despliegues

## Objetivos

- Crear y gestionar pods: definición manual, multi-contenedor e init containers
- Implementar persistencia de datos mediante volúmenes y StorageClasses
- Desplegar aplicaciones stateless con Deployments y HPA
- Gestionar aplicaciones con estado usando StatefulSets
- Entender DaemonSets para casos de uso en todos los nodos

## Conceptos clave

### Pods

Un pod es la unidad mínima desplegable en Kubernetes. Contiene uno o más contenedores que comparten red (IP, puerto) y almacenamiento.

**Tipos especiales:**
- **Multi-container pods**: Contenedores principales + sidecars para logging, proxies, etc.
- **Init containers**: Se ejecutan antes del contenedor principal para preparar el entorno (descargas, configuración).

La mayoría de pods tienen un único contenedor; los multi-contenedor se usan para patrones específicos.

### Volúmenes y Persistencia

Los volúmenes resuelven dos problemas: compartir datos entre contenedores en un pod y persistir datos más allá del ciclo de vida del contenedor.

**Tipos principales:**
- **emptyDir**: Almacenamiento temporal en el nodo, se elimina si el pod muere
- **hostPath**: Monta un directorio del nodo (útil en desarrollo, riesgoso en producción)
- **PersistentVolume (PV)**: Recurso de almacenamiento independiente del pod
- **PersistentVolumeClaim (PVC)**: Solicitud de almacenamiento por parte del pod

**StorageClass y provisioning dinámico**: Automatizan la creación de PVs bajo demanda, eliminando la necesidad de crear PVs manualmente. Define políticas de reclamación, tipo de almacenamiento y parámetros del proveedor.

### Deployments

Controlador que gestiona réplicas de pods stateless. Proporciona:

- **Estrategias de actualización**: RollingUpdate (gradual, sin downtime) y Recreate (rápido, con downtime)
- **Escalado manual**: `kubectl scale deployment`
- **HPA (Horizontal Pod Autoscaler)**: Escala automáticamente basado en CPU/memoria u métricas personalizadas

Ideal para aplicaciones sin estado (APIs, servidores web).

### StatefulSets

Para aplicaciones que requieren estado persistente, identidad estable y almacenamiento único por pod.

Características:
- Identidad ordenada: pod-0, pod-1, pod-2 (no aleatoria)
- Almacenamiento persistente vinculado a cada pod
- Ordinal estable: la orden de despliegue y actualización es secuencial

Casos de uso: bases de datos (MySQL, PostgreSQL), colas (RabbitMQ), cachés (Redis).

### DaemonSets

Asegura que **un pod corra en cada nodo** del cluster (o en un subconjunto según selectores).

Casos de uso:
- Logging (recolectar logs de todos los nodos)
- Monitoreo (exportadores Prometheus)
- Networking (mesh sidecars)
- Mantenimiento de nodos

Los DaemonSets se crean automáticamente en nuevos nodos que se unan al cluster.

## Comandos útiles

```bash
# Pods
kubectl run mi-pod --image=nginx                              # Crear pod
kubectl get pods -o wide                                      # Ver detalles de pods
kubectl describe pod mi-pod                                   # Ver detalles completos
kubectl logs mi-pod -c contenedor                             # Ver logs de un contenedor

# Volúmenes
kubectl get pv, pvc                                           # Ver volúmenes
kubectl describe pvc mi-pvc                                   # Detalles de reclamación

# Deployments
kubectl create deployment mi-deploy --image=nginx --replicas=3
kubectl set image deployment/mi-deploy nginx=nginx:1.21       # Actualizar imagen
kubectl rollout history deployment/mi-deploy                  # Historial de actualizaciones
kubectl rollout undo deployment/mi-deploy                     # Revertir actualización
kubectl autoscale deployment mi-deploy --min=2 --max=10 --cpu-percent=80

# StatefulSet
kubectl get statefulsets
kubectl describe statefulset mi-statefulset

# DaemonSet
kubectl get daemonsets
kubectl describe daemonset mi-daemonset
```

## Referencias

- [Kubernetes Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Volúmenes](https://kubernetes.io/docs/concepts/storage/volumes/)
- [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/)
- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
- [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
