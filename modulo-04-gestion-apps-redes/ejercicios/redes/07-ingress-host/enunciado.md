# Ejercicio 07 — Ingress host-based (multi-host)

Objetivo

Desplegar dos aplicaciones (app1 y app2) y crear un Ingress host-based que dirija `app1.local` a `app1` y `app2.local` a `app2`.

Criterios de éxito

- Despliegues y Services para `app1` y `app2` creados.
- Ingress con reglas por host funcionando.
- Verificación añadiendo entradas en /etc/hosts (por ejemplo, apuntando al IP del nodo/localhost) y haciendo curl a cada host.

Archivos

- manifests/solution/app1-deployment.yaml
- manifests/solution/app1-service.yaml
- manifests/solution/app2-deployment.yaml
- manifests/solution/app2-service.yaml
- manifests/solution/ingress.yaml

Verificación

kubectl apply -f manifests/solution/
# Añadir en /etc/hosts: <INGRESS_IP> app1.local app2.local
# curl --header 'Host: app1.local' http://<INGRESS_IP>/
# curl --header 'Host: app2.local' http://<INGRESS_IP>/
