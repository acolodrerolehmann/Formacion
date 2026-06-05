# Ejercicio 2: Corregir un StatefulSet y DaemonSet

## Escenario
Has recibido dos manifiestos con errores. El `StatefulSet` no define bien su almacenamiento y el `DaemonSet` no se programa donde corresponde.

Asume que ya existe un headless Service llamado `db-headless`.

## Objetivo
Corrige los archivos marcados con `# FIX:` sin crear recursos adicionales.

## Archivos a corregir
- `manifests/statefulset.yaml`
- `manifests/daemonset.yaml`

## Requisitos
### StatefulSet
1. Añade el `serviceName` correcto.
2. Corrige `volumeClaimTemplates` para que coincida con el `volumeMount`.
3. Usa un modo de acceso válido para una base de datos que escribe en disco.
4. Solicita `1Gi` de almacenamiento.

### DaemonSet
1. Corrige el `nodeSelector` para que el agente se ejecute en nodos Linux.
2. Añade tolerations para nodos `control-plane` y `master` con `NoSchedule`.

## Validación sugerida
kubectl apply --dry-run=client -f manifests/statefulset.yaml
kubectl apply --dry-run=client -f manifests/daemonset.yaml
kubectl get pods -o wide
