# Ejercicio 1: Configurar Network Policies

## Escenario
Tienes dos aplicaciones en el clúster:

- `frontend`: expone HTTP en el puerto `8080`
- `backend`: expone HTTP en el puerto `8080`

Debes configurar políticas de red para que se cumpla esto:

1. `frontend` puede acceder a `backend`
2. `backend` no puede iniciar conexiones hacia `frontend`
3. `backend` no acepta tráfico desde otros pods ni desde fuera del clúster

## Archivos

- `manifests/frontend.yaml`
- `manifests/backend.yaml`
- `manifests/network-policy.yaml`

## Tareas

1. Aplica los deployments de `frontend` y `backend`
2. Completa `manifests/network-policy.yaml`
3. Aplica las policies y valida el comportamiento

## Pistas

- Usa `podSelector` para apuntar a los pods correctos
- Usa `policyTypes: [Ingress]`
- Necesitas más de una `NetworkPolicy`
- Todo tráfico de entrada no permitido explícitamente quedará bloqueado
- Este ejercicio requiere un CNI con soporte de `NetworkPolicy`

## Validación

Obtén los nombres e IPs de los pods:

FRONTEND_POD=$(kubectl get pod -l app=frontend -o jsonpath='{.items[0].metadata.name}')
BACKEND_POD=$(kubectl get pod -l app=backend -o jsonpath='{.items[0].metadata.name}')
FRONTEND_IP=$(kubectl get pod "$FRONTEND_POD" -o jsonpath='{.status.podIP}')
BACKEND_IP=$(kubectl get pod "$BACKEND_POD" -o jsonpath='{.status.podIP}')

Comprueba que `frontend` sí puede llegar a `backend`:

kubectl exec "$FRONTEND_POD" -c toolbox -- wget -qO- "http://$BACKEND_IP:8080"

Comprueba que `backend` no puede llegar a `frontend`:

kubectl exec "$BACKEND_POD" -c toolbox -- wget -T 2 -qO- "http://$FRONTEND_IP:8080"

Resultado esperado:

- La primera petición responde `backend`
- La segunda petición falla por timeout o conexión rechazada
