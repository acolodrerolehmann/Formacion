# Ejercicio 01 — Service (ClusterIP)

Objetivo

Crear un Deployment llamado `hello-clusterip` (2 réplicas) que sirva una página HTTP simple (nginx) y exponerlo mediante un Service de tipo `ClusterIP` llamado `hello-clusterip`.

Criterios de éxito

- El Deployment tiene 2 réplicas en estado `Ready`.
- El Service `hello-clusterip` existe y tiene tipo `ClusterIP`.
- Se puede acceder al servicio desde dentro del clúster (por ejemplo, con un pod que ejecute curl) y devuelve HTTP 200.

Archivos a preparar

- manifests/template/deployment.yaml  (plantilla con TODO)
- manifests/template/service.yaml
- manifests/solution/deployment.yaml  (solución aplicable)
- manifests/solution/service.yaml

Comandos de verificación

kubectl apply -f manifests/solution/
kubectl get deploy hello-clusterip
kubectl get svc hello-clusterip
kubectl run --rm -it --image=curlimages/curl curlpod -- sh -c 'curl -sS http://hello-clusterip'

Notas

Este ejercicio demuestra el comportamiento por defecto de los Services dentro del clúster (no accesible desde el exterior sin proxy/port-forward).
