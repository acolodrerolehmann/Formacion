# Ejercicio 05 — Service ExternalName

Objetivo

Crear un Service de tipo `ExternalName` que apunte a un dominio externo (ej: `example.com`) y comprobar la resolución DNS desde dentro del clúster.

Criterios de éxito

- Service `external-example` de tipo ExternalName existente y resolviendo al host configurado.

Archivos

- manifests/solution/service.yaml

Verificación

kubectl apply -f manifests/solution/
# Desde un pod cliente:
kubectl run -it --rm --restart=Never --image=busybox dns-test -- nslookup external-example
