# Ejercicio 1: Crear y Gestionar Pods Básicos

## Escenario
Tu equipo necesita desplegar un pod sencillo para validar que el clúster acepta manifests básicos. Debes completar un manifiesto incompleto para levantar un servidor web Apache.

## Objetivo
Completa `manifests/pod-web.yaml` para crear un pod llamado `pod-web` que:
- use la imagen `httpd:2.4`
- exponga el puerto `80`
- tenga las etiquetas `app: web` y `tier: frontend`

## Pistas
- Un Pod usa `apiVersion: v1`.
- Las etiquetas se definen dentro de `metadata.labels`.
- El puerto del contenedor va en `spec.containers[].ports[].containerPort`.
- Puedes validar con `kubectl apply --dry-run=client -f manifests/pod-web.yaml`.

## Criterios de éxito
- El archivo YAML queda completo y válido.
- `kubectl apply -f manifests/pod-web.yaml` no devuelve errores.
- `kubectl get pod pod-web --show-labels` muestra el pod con las etiquetas esperadas.
- `kubectl describe pod pod-web` muestra el contenedor escuchando en el puerto 80.
