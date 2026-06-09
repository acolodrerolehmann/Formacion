# Ejercicio 03 — Service (LoadBalancer)

Objetivo

Crear un Deployment llamado `hello-loadbalancer` y exponerlo con un Service de tipo `LoadBalancer`.

Criterios de éxito

- El Deployment tiene 1-2 réplicas en estado `Ready`.
- El Service `hello-loadbalancer` existe y tiene tipo `LoadBalancer`.
- En entornos sin proveedor de LoadBalancer (Kind/Minikube), usar la alternativa NodePort o MetalLB (se incluye ejemplo alternativo).

Archivos:

- manifests/solution/deployment.yaml
- manifests/solution/service.yaml
- manifests/solution/alternative-nodeport.yaml

Comandos de verificación

kubectl apply -f manifests/solution/
kubectl get svc hello-loadbalancer

# Si EXTERNAL-IP aparece, acceder por esa IP; si está Pending, usar la alternativa NodePort:
# kubectl apply -f manifests/solution/alternative-nodeport.yaml

Notas

- MetalLB es una opción para crear IPs tipo LoadBalancer en entornos locales; su configuración requiere un rango de IPs válido para tu red local.
