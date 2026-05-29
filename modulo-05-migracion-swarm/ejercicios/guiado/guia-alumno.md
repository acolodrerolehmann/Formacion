# Ejercicio Guiado: Migrando un docker-compose a Kubernetes con Kompose

## Guía del Alumno

### Objetivo
Aprender a migrar una aplicación definida en docker-compose a manifiestos de Kubernetes, entendiendo el mapeo de conceptos entre ambas plataformas.

---

### Paso 1: Revisar el Docker Compose Original

Examina el archivo `docker-compose.yaml` que define nuestra aplicación:

```bash
cat manifests/docker-compose.yaml
```

La aplicación tiene:
- **web**: una aplicación Python/Flask que se conecta a Redis
- **redis**: base de datos en memoria para caché

Fíjate en: puertos expuestos, variables de entorno, dependencias entre servicios.

---

### Paso 2: Conversión con Kompose

[Kompose](https://kompose.io/) convierte archivos docker-compose a manifiestos de Kubernetes.

```bash
# Si tienes kompose instalado:
kompose convert -f manifests/docker-compose.yaml --out /tmp/kompose-output/
```

> **Nota:** Si no tienes kompose, los manifiestos ya están disponibles en `manifests/`. Kompose genera archivos similares a estos.

---

### Paso 3: Revisar los Manifiestos Generados

Examina cada manifiesto y compáralo con el docker-compose:

```bash
cat manifests/web-deployment.yaml
```

**Mapeo de conceptos:**

| Docker Compose | Kubernetes |
|----------------|-----------|
| `services.web` | Deployment + Service |
| `ports: "5000:5000"` | Service con port/targetPort |
| `environment:` | `env:` en el container spec |
| `depends_on:` | No tiene equivalente directo (usar readiness probes) |
| `image:` | `containers[].image` |

```bash
cat manifests/web-service.yaml
cat manifests/redis-deployment.yaml
cat manifests/redis-service.yaml
```

---

### Paso 4: Aplicar al Clúster

```bash
kubectl apply -f manifests/web-deployment.yaml
kubectl apply -f manifests/web-service.yaml
kubectl apply -f manifests/redis-deployment.yaml
kubectl apply -f manifests/redis-service.yaml
```

**Resultado esperado:** Todos los recursos creados sin errores.

---

### Paso 5: Verificar el Funcionamiento

```bash
# Ver que los pods están Running
kubectl get pods
```

```bash
# Ver los servicios
kubectl get services
```

```bash
# Ver logs de la app web
kubectl logs -l app=web
```

```bash
# Probar la conectividad (port-forward)
kubectl port-forward svc/web 5000:5000 &
curl http://localhost:5000
```

**Resultado esperado:** La app web responde y se comunica con Redis correctamente.

---

### Paso 6: Qué Ajustar Manualmente

Kompose genera una base, pero en producción necesitas añadir:

- **Resources** (requests/limits de CPU y memoria)
- **Health checks** (readinessProbe, livenessProbe)
- **Volúmenes persistentes** (PVC en vez de volúmenes locales)
- **Security context** (no ejecutar como root)
- **Network Policies** (restringir tráfico)

---

### Paso 7: Limpieza

```bash
kubectl delete -f manifests/web-deployment.yaml -f manifests/web-service.yaml
kubectl delete -f manifests/redis-deployment.yaml -f manifests/redis-service.yaml
```

---

### Resumen

| Concepto Swarm/Compose | Equivalente Kubernetes |
|------------------------|----------------------|
| `docker-compose.yaml` | Múltiples manifiestos YAML |
| `services:` | Deployment + Service |
| `networks:` | Network Policies / Services |
| `volumes:` | PV + PVC |
| `deploy.replicas:` | `spec.replicas:` |
| `ports:` | Service (ClusterIP/NodePort/LoadBalancer) |

### Referencias
- [Kompose](https://kompose.io/)
- [Migración de Compose a Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/)
