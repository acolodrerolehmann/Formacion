# Ejercicio 1: Crear un ReplicaSet con Servicio

## Escenario
Debes desplegar una aplicación `nginx` con **3 Pods** gestionados por un **ReplicaSet** y exponerlos dentro del clúster con un **Service**.

## Objetivo
Completa los manifiestos para que:
- El ReplicaSet mantenga 3 réplicas.
- Los Pods usen labels consistentes.
- El Service seleccione esos Pods.
- El tráfico llegue al puerto 80 de `nginx`.

## Tareas
1. Completa `manifests/replicaset.yaml`.
2. Completa `manifests/service.yaml`.
3. Aplica ambos recursos con `kubectl apply -f`.
4. Verifica que el Service tenga endpoints.

## Pistas
- El label principal puede ser `app: nginx`.
- El Service debe usar el mismo selector que los Pods.
- `nginx` escucha en el puerto `80`.

## Validación
kubectl apply -f manifests/replicaset.yaml
kubectl apply -f manifests/service.yaml
kubectl get rs
kubectl get pods -l app=nginx
kubectl get svc
kubectl describe svc nginx-service
