# Ejercicio 1: Migrar un Docker Compose Multi-Servicio

## Escenario

Tienes una aplicación definida en `docker-compose.yaml` con tres servicios:

- `web`: frontend público
- `api`: backend interno
- `database`: PostgreSQL con datos persistentes

Tu tarea es migrar manualmente esa definición a manifiestos de Kubernetes.

## Archivos

- `manifests/docker-compose.yaml`: referencia original
- `manifests/k8s-web.yaml`: manifiestos incompletos del frontend
- `manifests/k8s-api.yaml`: manifiestos incompletos del backend
- `manifests/k8s-database.yaml`: manifiestos incompletos de la base de datos

## Tareas

1. Completa los tres archivos YAML con recursos válidos de Kubernetes.
2. Mantén las réplicas configuradas para `web` y `api`.
3. Usa un `Service` externo para `web`.
4. Usa `Service` internos para `api` y `database`.
5. Conserva las variables de entorno necesarias para la comunicación entre servicios.
6. Añade almacenamiento persistente para la base de datos.

## Pistas

- `depends_on` no se traduce 1:1 en Kubernetes.
- La comunicación entre pods debe usar DNS interno de Services.
- El volumen de PostgreSQL debe migrarse a un `PersistentVolumeClaim`.

## Resultado esperado

Al final debes tener:

- `web` accesible desde fuera del cluster
- `api` accesible solo dentro del cluster
- `database` con persistencia
- Comunicación `web -> api -> database` usando nombres de Service
