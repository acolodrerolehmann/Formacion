# Ejercicio 2: Corregir Labels y Selectors

## Escenario
Tienes un **ReplicaSet** y un **Service** ya definidos, pero el Service no encuentra Pods porque los **labels** y **selectors** no coinciden.

## Objetivo
Corrige el manifiesto para que:
- El ReplicaSet cree Pods válidos.
- El Service seleccione esos Pods.
- La aplicación quede accesible dentro del clúster.

## Tareas
1. Revisa `manifests/app-broken.yaml`.
2. Corrige los campos marcados con `# FIX:`.
3. Guarda el resultado corregido y aplícalo.
4. Comprueba que el Service tenga endpoints.

## Pistas
- El selector del Service debe coincidir con los labels de los Pods.
- No cambies la imagen ni los puertos.
- Revisa el label `app` y el label `tier`.

## Validación
```bash
kubectl apply -f manifests/app-broken.yaml
kubectl get rs
kubectl get pods --show-labels
kubectl get svc
kubectl describe svc tienda-service
```
