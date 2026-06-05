# Módulo 2: Componentes y Arquitectura de Kubernetes

## Objetivos

- Comprender la arquitectura fundamental de un clúster Kubernetes
- Dominar los componentes principales del control plane y los nodos
- Aprender a usar Pods, Labels y Selectors para organizar cargas de trabajo
- Implementar mecanismos de alta disponibilidad con ReplicaSets
- Configurar comunicación entre Pods mediante Servicios
- Interactuar con Kubernetes mediante su API REST

---

## Conceptos Clave

### Pods: Unidad Mínima de Despliegue

Un **Pod** es la unidad más pequeña en Kubernetes. Encapsula uno o más contenedores que comparten:
- Espacios de red (IP única)
- Volúmenes de almacenamiento
- Configuración de ejecución

Los Pods son **efímeros**: se crean y destruyen dinámicamente. Nunca se despliegan Pods aislados en producción; siempre se usan controladores como ReplicaSets.

### Labels y Selectors: Organización Flexible

**Labels** son pares clave-valor que permiten identificar y agrupar recursos de forma flexible. **Selectors** son consultas que filtran recursos basándose en sus labels.

Casos de uso:
- Identificar ambiente: `env: production`, `env: development`
- Versión de aplicación: `version: v1.0`
- Componentes: `component: database`, `component: frontend`

### Replication Controllers y ReplicaSets

**ReplicaSet** garantiza que siempre haya un número específico de réplicas de un Pod ejecutándose. Si un Pod falla, el ReplicaSet automáticamente crea otro.

**Replication Controller** es el predecesor de ReplicaSet con funcionalidad similar pero menos flexible. Se recomienda usar **ReplicaSets** o **Deployments** (que envuelven ReplicaSets).

### Nodos: Maestros y Trabajadores

Un clúster Kubernetes consta de:

- **Master Nodes (Control Plane)**: Gestionan el estado del clúster
- **Worker Nodes**: Ejecutan los Pods

### Servicios: Comunicación de Pods

Los Servicios exponen Pods con una IP y DNS estables. Tipos principales:

- **ClusterIP**: Solo accesible dentro del clúster (defecto)
- **NodePort**: Expone el servicio en un puerto de cada nodo
- **LoadBalancer**: Proporciona IP externa para acceder desde fuera del clúster

### Componentes del Control Plane

- **API Server**: Valida y procesa solicitudes REST
- **Scheduler**: Asigna Pods a nodos disponibles
- **Controller Manager**: Ejecuta controladores (ReplicaSets, Deployments, etc.)
- **etcd**: Base de datos distribuida que almacena el estado del clúster

### Componentes de los Nodos

- **Kubelet**: Agente que ejecuta Pods y reporta estado al API Server
- **Kube-Proxy**: Gestiona reglas de red para enrutamiento de tráfico
- **Container Runtime**: Ejecuta contenedores (Docker, containerd, etc.)

### API de Kubernetes

La **API REST de Kubernetes** permite:
- Crear, leer, actualizar y eliminar recursos
- Automatizar operaciones mediante scripts o aplicaciones
- Integrar Kubernetes con herramientas externas

Acceso mediante `kubectl` (cliente CLI) o directamente via HTTP.

---

## Comandos Útiles

# Inspeccionar componentes del control plane
kubectl get nodes
kubectl describe node <nombre-nodo>

# Trabajar con Pods
kubectl get pods
kubectl describe pod <nombre-pod>
kubectl logs <nombre-pod>

# Usar Labels y Selectors
kubectl label pod <nombre-pod> app=myapp
kubectl get pods -l app=myapp

# Crear y gestionar ReplicaSets
kubectl create -f replicaset.yaml
kubectl get replicasets
kubectl scale replicaset <nombre> --replicas=3

# Servicios
kubectl get services
kubectl expose pod <nombre-pod> --type=ClusterIP --port=8080

# API Server
kubectl api-resources
kubectl api-versions

---

## Referencias

- [Documentación oficial de Kubernetes - Arquitectura](https://kubernetes.io/docs/concepts/architecture/)
- [Pods en Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Labels y Selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
- [Servicios](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Control Plane Components](https://kubernetes.io/docs/concepts/overview/components/)
- [API de Kubernetes](https://kubernetes.io/docs/reference/using-api/)

---

**Próximos pasos**: Módulo 3 - Deployments y Actualizaciones
