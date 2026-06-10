# Quickstart: ConfigMap y Secret (rápido)

1. Crear namespace de prueba:

```bash
kubectl create namespace quick-config
```

2. Aplicar ConfigMap simple y Secret Opaque:

```bash
kubectl apply -f configmap-simple.yaml -n quick-config
kubectl apply -f secret-opaque.yaml -n quick-config
```

3. Desplegar un pod que use ambos:

```yaml
# file: pod-uses-config-secret.yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-test
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh","-c","env; sleep 3600"]
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_HOST
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

```bash
kubectl apply -f pod-uses-config-secret.yaml -n quick-config
kubectl exec -n quick-config pod/app-test -- env | grep -E "DB_"
```

4. Limpieza:

```bash
kubectl delete namespace quick-config
```
