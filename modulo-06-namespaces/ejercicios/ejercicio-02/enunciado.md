# Ejercicio 2: Aislar Entornos con Namespaces y RBAC

## Escenario
El clúster compartirá dos entornos: desarrollo y producción. Debes separar ambos con namespaces y dejar un `ServiceAccount` con permisos solo en desarrollo.

## Objetivo
Completa los manifiestos para crear los namespaces `dev` y `prod`, y configurar un `ServiceAccount` llamado `dev-reader` que solo pueda leer recursos en `dev`.

## Archivos
- `manifests/namespaces.yaml`
- `manifests/rbac.yaml`

## Requisitos
1. Crear los namespaces `dev` y `prod`.
2. Crear un `ServiceAccount` llamado `dev-reader` en `dev`.
3. Crear un `Role` en `dev` que permita `get`, `list` y `watch` sobre `pods`, `services` y `configmaps`.
4. Vincular ese `Role` al `ServiceAccount` con un `RoleBinding` en `dev`.
5. Corregir el manifiesto RBAC: contiene un binding incorrecto que rompe el aislamiento entre entornos. El resultado final no debe otorgar permisos en `prod`.

## Tareas
1. Completa los `# TODO:`.
2. Revisa los bloques marcados con `# FIX:` y corrígelos.
3. Aplica los manifiestos con:
   - `kubectl apply -f manifests/namespaces.yaml`
   - `kubectl apply -f manifests/rbac.yaml`
4. Verifica el resultado con:
   - `kubectl auth can-i get pods --as=system:serviceaccount:dev:dev-reader -n dev`
   - `kubectl auth can-i get pods --as=system:serviceaccount:dev:dev-reader -n prod`

## Criterios de éxito
- El acceso en `dev` responde `yes`.
- El acceso en `prod` responde `no`.
- El `ServiceAccount` no recibe permisos efectivos fuera de `dev`.
