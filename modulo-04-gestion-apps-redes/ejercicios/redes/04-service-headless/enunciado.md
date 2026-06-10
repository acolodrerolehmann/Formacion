# Ejercicio 04 — Service Headless (StatefulSet)

Objetivo

Crear un Service headless (`clusterIP: None`) llamado `headless-app` y un StatefulSet con 2 réplicas que use ese servicio para descubrimiento DNS entre pods.

Criterios de éxito

- Service `headless-app` con `clusterIP: None` creado.
- StatefulSet `headless-app` con 2 réplicas en estado `Ready`.
- Los pods resuelven nombres DNS del tipo `pod-0.headless-app`, `pod-1.headless-app`.

Archivos

- manifests/solution/headless-service.yaml
- manifests/solution/statefulset.yaml

Verificación

kubectl apply -f manifests/solution/
kubectl get svc headless-app
kubectl get sts headless-app
# Ejemplo de verificación DNS desde un pod:
kubectl run -it --rm --restart=Never --image=busybox dns-test -- nslookup pod-0.headless-app
