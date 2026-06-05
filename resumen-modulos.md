# Curso de Formación: Kubernetes

**Duración total:** 20 horas teórico-prácticas
**Formato:** 7 módulos con ejercicios guiados y autónomos

---

## Módulo 1 — Introducción a Kubernetes (2h)

- Qué es la orquestación de contenedores y por qué es necesaria
- Conceptos fundamentales de Kubernetes
- Ecosistema y casos de uso

## Módulo 2 — Componentes y Arquitectura (3h)

- Arquitectura del clúster: Control Plane y Worker Nodes
- Pods, Labels y Selectors
- ReplicaSets y alta disponibilidad
- Servicios: ClusterIP, NodePort, LoadBalancer
- API REST de Kubernetes

## Módulo 3 — Instalación de Kubernetes (3h)

- Opciones de instalación según entorno (kubeadm, minikube, kind)
- Configuración de un clúster local/on-premise
- Validación y diagnóstico de la instalación

## Módulo 4 — Gestión de Aplicaciones, Redes y Extensibilidad (4h)

- ConfigMaps y Secrets: gestión de configuración
- Helm: empaquetado y despliegue de aplicaciones
- Operadores: automatización de tareas complejas
- Network Policies: seguridad de red entre pods
- Ingress: exposición de servicios HTTP/HTTPS
- Estrategias de actualización: Rolling Update, Canary, Blue-Green
- CRDs (Custom Resource Definitions): extensión de la API

## Módulo 5 — Migración de Docker Swarm a Kubernetes (2h)

- Diferencias y similitudes arquitectónicas entre Swarm y Kubernetes
- Mapeo de conceptos: Services → Deployments, Compose → Helm
- Herramientas de migración (Kompose, Kustomize)
- Buenas prácticas y estrategia de transición incremental

## Módulo 6 — Namespaces (3h)

- Aislamiento lógico de recursos y multitenencia
- Gestión de múltiples entornos (dev, staging, producción)
- ResourceQuotas y LimitRanges
- RBAC: control de acceso por namespace
- Comunicación entre namespaces (DNS interno)

## Módulo 7 — Pods, Volúmenes y Despliegues (3h)

- Pods: multi-contenedor, init containers, ciclo de vida
- Volúmenes: PersistentVolumes, PersistentVolumeClaims, StorageClasses
- Deployments y escalado automático (HPA)
- StatefulSets: aplicaciones con estado
- DaemonSets: pods en todos los nodos

---

**Metodología:** Cada módulo incluye teoría breve, un ejercicio guiado en clase y dos ejercicios para resolver de forma autónoma (21 ejercicios en total).
