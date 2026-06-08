# Ejercicio guiado: ReplicaSet (inspección y escalado)

Objetivo
- Entender qué es un ReplicaSet y cómo mantiene el número de réplicas.

Pasos
1. Aplicar el manifiesto:

```bash
kubectl apply -f manifests/replicaset-example.yaml
```

2. Ver los ReplicaSets y pods:

```bash
kubectl get rs
kubectl get pods -l app=nginx-rs -o wide
```

3. Escalar el ReplicaSet a 5 réplicas:

```bash
kubectl scale rs/nginx-replicaset --replicas=5
kubectl get pods -l app=nginx-rs -o wide
```

4. Eliminar un pod y observar que el ReplicaSet lo reemplaza:

```bash
kubectl delete pod -l app=nginx-rs --now
kubectl get pods -l app=nginx-rs -o wide
```

5. Limpieza:

```bash
kubectl delete -f manifests/replicaset-example.yaml
```

Observaciones
- Un ReplicaSet gestiona pods individuales; normalmente se trabaja a través de un Deployment que crea/gestiona ReplicaSets automáticamente.
