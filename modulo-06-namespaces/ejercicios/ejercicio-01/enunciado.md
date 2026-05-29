# Ejercicio 1: Configurar ResourceQuotas y LimitRanges

## Escenario
Tu equipo va a desplegar aplicaciones en un namespace dedicado. Antes de permitir despliegues, debes limitar el consumo global del namespace y definir valores por defecto para los contenedores que no declaren recursos.

## Objetivo
Completa los manifiestos para crear un namespace llamado `team-a`, una `ResourceQuota` y un `LimitRange`.

## Archivos
- `manifests/namespace.yaml`
- `manifests/resource-quota.yaml`
- `manifests/limit-range.yaml`

## Requisitos
1. Crear el namespace `team-a`.
2. Crear una `ResourceQuota` en ese namespace con:
   - máximo total de `2` CPU
   - máximo total de `4Gi` de memoria
   - máximo de `10` pods
3. Crear un `LimitRange` para contenedores en `team-a` con:
   - `defaultRequest.cpu: 100m`
   - `defaultRequest.memory: 128Mi`
   - `default.cpu: 500m`
   - `default.memory: 512Mi`
4. Mantener los nombres base ya definidos en los manifiestos.

## Tareas
1. Completa los `# TODO:` de los tres archivos.
2. Aplica los manifiestos con `kubectl apply -f manifests/`.
3. Verifica el resultado con:
   - `kubectl get resourcequota -n team-a`
   - `kubectl describe quota team-a-quota -n team-a`
   - `kubectl describe limits team-a-limits -n team-a`

## Criterios de éxito
- Los tres recursos se crean sin errores.
- La cuota queda aplicada a `team-a`.
- El `LimitRange` define valores por defecto para contenedores del namespace.
