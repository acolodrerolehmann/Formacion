# Ejercicio 09 — NetworkPolicy (permitir/denegar tráfico)

Objetivo

Crear una NetworkPolicy que permita tráfico TCP al pod servidor solo desde pods con la etiqueta `access: allowed` y deniegue el resto.

Criterios de éxito

- Deployment `np-server` y Service `np-server` creados.
- NetworkPolicy `allow-from-labeled` en vigor.
- `client-allowed` puede conectar a `np-server:80`, `client-denied` no.

Archivos

- manifests/solution/np-server-deployment.yaml
- manifests/solution/np-server-service.yaml
- manifests/solution/client-allowed-pod.yaml
- manifests/solution/client-denied-pod.yaml
- manifests/solution/networkpolicy.yaml

Verificación

kubectl apply -f manifests/solution/
# Desde client pods intentar curl o nc al servicio y comprobar acceso/denegación
