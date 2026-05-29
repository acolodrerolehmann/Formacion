# Ejercicio 2: Crear un Ingress con Rutas

## Escenario
Ya existen dos aplicaciones en el clúster:

- `frontend`: expone HTTP en el puerto `8080`
- `backend`: expone HTTP en el puerto `8080`

Debes publicar ambas con un único `Ingress`:

- `/api` debe ir al servicio del `backend`
- `/` debe ir al servicio del `frontend`

## Archivos

- `manifests/services.yaml`
- `manifests/ingress.yaml`

## Tareas

1. Corrige los puertos en `manifests/services.yaml`
2. Completa `manifests/ingress.yaml`
3. Aplica ambos manifiestos
4. Verifica que las rutas apunten al servicio correcto

## Pistas

- Los dos servicios deben ser `ClusterIP`
- Usa `pathType: Prefix`
- El `Ingress` ya asume `ingressClassName: nginx`
- El `Ingress` debe apuntar al puerto del `Service`, no al puerto del contenedor

## Validación

Aplica los manifiestos:

```bash
kubectl apply -f manifests/services.yaml
kubectl apply -f manifests/ingress.yaml
```

Revisa la configuración:

```bash
kubectl describe ingress apps-ingress
kubectl get svc frontend-svc backend-svc
```

Si tienes un controlador Ingress operativo, comprueba:

```bash
curl http://<INGRESS_IP>/
curl http://<INGRESS_IP>/api
```

Resultado esperado:

- `/` llega a `frontend-svc`
- `/api` llega a `backend-svc`
