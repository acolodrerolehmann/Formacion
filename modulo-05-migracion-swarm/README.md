# Módulo 5: Migración de Docker Swarm a Kubernetes

## Objetivos

- Comprender las diferencias arquitectónicas entre Docker Swarm y Kubernetes
- Identificar similaridades y estrategias de transición
- Mapear conceptos de Swarm a recursos de Kubernetes
- Aplicar buenas prácticas durante la migración
- Utilizar herramientas automatizadas para facilitar la migración

---

## Conceptos Clave

### Comparativa Swarm vs Kubernetes

#### Diferencias Arquitectónicas

| Aspecto | Docker Swarm | Kubernetes |
|--------|-------------|-----------|
| **Modelo de cluster** | Descentralizado, basado en Raft | Distribuido con control plane |
| **Orquestación** | Simple, basada en servicios | Compleja, basada en objetos |
| **Escalabilidad** | Limitada (miles de nodos) | Masiva (miles de nodos) |
| **Networking** | Overlay networks nativas | Network plugins (CNI) |
| **Persistencia** | Volúmenes limitados | Storage classes avanzadas |
| **Actualizaciones** | Rolling updates básicas | Sophisticated deployment strategies |

#### Similitudes y Facilidades

- Ambos utilizan contenedores Docker como unidad base
- Conceptos compartidos: réplicas, health checks, resource limits
- Aproximación declarativa en ambos sistemas
- Soporte para multi-nodo y alta disponibilidad

### Mapeo de Conceptos

#### Swarm Services → Kubernetes Deployments

```
Swarm Service:
  - docker service create --replicas 3 my-app

Kubernetes Deployment:
  - apiVersion: apps/v1
    kind: Deployment
    spec:
      replicas: 3
```

#### Swarm Networks → Kubernetes Services/NetworkPolicies

- **Swarm overlay networks** → Kubernetes Network Policies (CNI plugins como Calico)
- **Service discovery (DNS interno)** → Kubernetes Service DNS (cluster.local)
- **Publicación de puertos** → Kubernetes Service types (ClusterIP, NodePort, LoadBalancer)

#### Docker Compose → Helm Charts

- Docker Compose define servicios localmente
- Helm Charts proporcionan templating y versionamiento para Kubernetes
- Kompose convierte directamente `docker-compose.yml` → manifiestos K8s

### Buenas Prácticas de Migración

1. **Análisis previo**: Inventariar servicios, dependencias y requisitos de persistencia
2. **Migración incremental**: No migres todo de una vez; comienza con workloads no críticos
3. **Resource requests/limits**: Kotlin no los hereda; especifícalos explícitamente
4. **Gestión de estado**: Planifica estrategia para datos persistentes (PersistentVolumes, bases de datos externas)
5. **Ingress en lugar de puertos expuestos**: Usa Kubernetes Ingress para routing
6. **Secrets y ConfigMaps**: Reemplaza variables de entorno Swarm con K8s Secrets/ConfigMaps
7. **Rollback strategy**: Define políticas de rollback claras antes de migrar
8. **Testing en staging**: Valida la migración en ambiente de prueba antes de producción

---

## Herramientas Útiles

### Kompose

Convierte automáticamente `docker-compose.yml` a manifiestos Kubernetes:

```bash
# Instalación
curl -L https://github.com/kubernetes/kompose/releases/download/v1.28.0/kompose-linux-amd64 -o kompose
chmod +x kompose

# Uso básico
./kompose convert -f docker-compose.yml -o output/

# Con generación de Helm
./kompose convert -c -f docker-compose.yml
```

### Otras herramientas

- **Skaffold**: Automatiza ciclo de dev/test
- **Ksonnet**: Template engine para K8s
- **Kustomize**: Customización nativa de manifiestos K8s

---

## Comandos Útiles

```bash
# Validar manifiestos antes de desplegar
kubectl apply -f deployment.yaml --dry-run=client

# Verificar estado de migración
kubectl get deployments,services,pods

# Ver logs de pods
kubectl logs -f <pod-name>

# Ejecutar troubleshooting
kubectl describe pod <pod-name>
kubectl exec -it <pod-name> -- /bin/bash

# Rollback de deployments
kubectl rollout undo deployment/<deployment-name>
```

---

## Referencias

- [Kubernetes Documentation - Concepts](https://kubernetes.io/docs/concepts/)
- [Docker Swarm to Kubernetes Migration Guide](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kompose Project](https://kompose.io/)
- [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [Helm - Kubernetes Package Manager](https://helm.sh/)

---

**Tiempo estimado**: 6-8 horas  
**Nivel**: Intermedio-Avanzado  
**Prerrequisitos**: Módulos 1-4 completados, conocimiento de Docker Swarm
