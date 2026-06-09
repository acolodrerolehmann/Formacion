# Ejercicio 10 — Servicio básico y ejemplos no-HTTP

Objetivo

Ofrecer ejemplos de servicios que no sean HTTP: un Redis (TCP) expuesto como Service y, opcionalmente, alternativas NodePort.

Criterios de éxito

- Deployment `redis` en ejecución.
- Service `redis` (ClusterIP) creado en el clúster.
- Posibilidad de conectarse internamente con redis-cli desde un pod cliente.

Archivos

- manifests/solution/redis-deployment.yaml
- manifests/solution/redis-service.yaml
- manifests/solution/redis-nodeport.yaml (alternativa)

Verificación

kubectl apply -f manifests/solution/
# Desde un pod cliente: redis-cli -h redis

Notas

- Redis es un ejemplo TCP; puedes usar otros servicios (MySQL, PostgreSQL) para practicar puertos/servicios TCP.
