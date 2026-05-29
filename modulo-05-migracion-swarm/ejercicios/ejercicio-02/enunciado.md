# Ejercicio 2: Corregir una Migración Incompleta

## Escenario

Otro equipo ya intentó migrar una aplicación desde Docker Compose a Kubernetes, pero dejó varios errores en los manifiestos.

Tu tarea es revisar los YAML y corregir la migración.

## Archivos

- `manifests/deployment.yaml`: deployments con errores marcados
- `manifests/service.yaml`: services con errores marcados

## Problemas a resolver

1. Los tipos de `Service` no son correctos.
2. Faltan variables de entorno clave para la comunicación entre servicios.
3. La base de datos no tiene almacenamiento persistente.

## Tareas

1. Corrige los recursos existentes.
2. Añade los recursos que falten si son necesarios.
3. Deja `web` expuesto fuera del cluster.
4. Deja `api` y `database` como servicios internos.
5. Garantiza que PostgreSQL use un `PersistentVolumeClaim`.

## Resultado esperado

- `web` puede consumir la API usando DNS interno
- `api` puede conectarse a la base de datos con todas las variables necesarias
- `database` conserva datos aunque el pod se recree

Puedes añadir documentos YAML extra en los mismos archivos si lo necesitas.
