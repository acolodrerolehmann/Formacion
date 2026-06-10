# Ejercicio 06 — Ingress básico (path-based)

Objetivo

Crear un Ingress que dirija las peticiones con path `/app` al Service `hello-clusterip` (ejercicio 01).

Criterios de éxito

- Ingress `hello-ingress` creado y con la regla `/app` apuntando al Service correcto.
- Comprobación con curl (desde host si se ha configurado Ingress controller y /etc/hosts si es necesario).

Archivos

- manifests/solution/ingress.yaml

Verificación

kubectl apply -f manifests/solution/ 
kubectl get ingress hello-ingress
# Desde host (si el controlador está expuesto): curl http://<INGRESS_HOST>/app
