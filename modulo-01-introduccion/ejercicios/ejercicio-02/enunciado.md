# Ejercicio 2: Identificar y Corregir Errores en un Pod

## Escenario
Has recibido un manifiesto de un compañero, pero el pod no se puede crear. El archivo contiene varios errores básicos que debes detectar y corregir antes del despliegue.

## Objetivo
Revisa `manifests/pod-errores.yaml`, identifica los problemas marcados y genera una versión corregida que cree un pod funcional.

## Pistas
- Comprueba la versión correcta del recurso Pod.
- Revisa los campos obligatorios de `metadata` y de cada contenedor.
- Verifica el formato de la imagen del contenedor.
- Valida con `kubectl apply --dry-run=client -f manifests/pod-errores.yaml` después de corregirlo.

## Criterios de éxito
- Todos los marcadores `# FIX:` quedan resueltos.
- El manifiesto corregido es válido.
- `kubectl apply -f manifests/pod-errores.yaml` crea el pod sin errores.
- `kubectl get pod pod-corregido` muestra el pod creado.
