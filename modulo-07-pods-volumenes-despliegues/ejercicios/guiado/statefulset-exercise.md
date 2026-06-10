# Ejercicio guiado: StatefulSet con Headless Service y PVCs

Objetivo
- Aprender la identidad estable de pods en StatefulSet y cómo se asignan PVCs por ordinal.

Pasos
1. Aplicar el manifiesto (crea Headless Service + StatefulSet):

```bash
kubectl apply -f manifests/statefulset-example.yaml
```

2. Ver recursos:

```bash
kubectl get svc,statefulset,pods -l app=web -o wide
```

3. Comprobar nombres y orden (ordinal):

```bash
# Debes ver pods con nombres: web-stateful-0, web-stateful-1, web-stateful-2
kubectl get pods -l app=web -o wide
```

4. Probar persistencia:

```bash
kubectl exec -it web-stateful-0 -- sh -c 'echo "identidad-0-$(date)" > /usr/share/nginx/html/secret.txt'
# Borrar el pod 0
kubectl delete pod web-stateful-0
# Esperar que se reprovisione
kubectl wait --for=condition=ready pod/web-stateful-0 --timeout=120s
# Verificar el contenido
kubectl exec -it web-stateful-0 -- cat /usr/share/nginx/html/secret.txt
```

5. Limpieza:

```bash
kubectl delete -f manifests/statefulset-example.yaml
```

Notas
- El StatefulSet asigna PVCs por pod ordinal; al eliminar un pod el PVC permanece (por defecto) y cuando el pod se recrea recupera su volumen.
- En clústeres con StorageClass por defecto, los PVCs deberían crearse automáticamente.
