# Módulo 6: Namespaces

Los namespaces son la base del multitenencia en Kubernetes, permitiendo aislar recursos y gestionar múltiples entornos en un único clúster.

## Objetivos

- Comprender el concepto de namespaces y su rol en el aislamiento de recursos
- Identificar y gestionar los namespaces por defecto
- Implementar estrategias de multitenencia con namespaces
- Configurar límites de recursos y políticas de acceso por namespace
- Gestionar comunicación entre namespaces

## Conceptos Clave

### Qué son los Namespaces

Un namespace es una abstracción de Kubernetes para aislar grupos de recursos dentro de un clúster. Proporcionan:

- **Aislamiento lógico**: Separación de recursos sin requerir múltiples clústeres
- **Control de acceso**: RBAC granular por namespace
- **Gestión de recursos**: Cuotas y límites independientes por namespace
- **DNS segregado**: Cada namespace tiene su propio espacio de nombres DNS

Los recursos dentro de un namespace están nombrados de forma única, pero pueden existir recursos con el mismo nombre en diferentes namespaces.

### Namespaces por Defecto

Kubernetes crea automáticamente cuatro namespaces:

- **default**: Donde se crean recursos si no se especifica otro namespace
- **kube-system**: Componentes del sistema (apiserver, controller-manager, scheduler, etcd)
- **kube-public**: Recursos públicos y configuraciones accesibles por todos
- **kube-node-lease**: Información de disponibilidad de nodos (node heartbeats)

### Gestión de Múltiples Entornos

Una estrategia común es crear namespaces separados para dev, staging y producción:

kubectl create namespace development
kubectl create namespace staging
kubectl create namespace production

Esto permite:
- Reutilizar el mismo clúster para múltiples entornos
- Aplicar políticas específicas por entorno
- Reducir costos de infraestructura
- Facilitar testing y desarrollo

### Políticas y Límites de Recursos

**ResourceQuotas**: Limitan el consumo total de recursos en un namespace:
- CPU y memoria totales disponibles
- Número máximo de pods, servicios, PVCs

**LimitRanges**: Establecen límites por recurso individual:
- Solicitudes y límites mínimos/máximos de CPU y memoria
- Límites de almacenamiento

**RBAC por Namespace**: Control granular de permisos:
- Roles y RoleBindings restringidos al namespace
- ClusterRoles para permisos globales
- ServiceAccounts con permisos específicos

### DNS y Comunicación entre Namespaces

La comunicación intra-namespace es directa por nombre del recurso.

Para comunicación inter-namespace:
servicio.namespace.svc.cluster.local

Ejemplo: Un pod en `production` accediendo a un servicio en `staging`:
curl http://api-service.staging.svc.cluster.local:8080

## Comandos Útiles

# Listar namespaces
kubectl get namespaces
kubectl get ns

# Crear namespace
kubectl create namespace <nombre>

# Cambiar namespace por defecto
kubectl config set-context --current --namespace=<nombre>

# Ejecutar comando en namespace específico
kubectl get pods -n <nombre>
kubectl apply -f archivo.yaml -n <nombre>

# Eliminar namespace (elimina todos los recursos dentro)
kubectl delete namespace <nombre>

# Ver ResourceQuotas
kubectl describe quota -n <nombre>

# Ver LimitRanges
kubectl describe limits -n <nombre>

## Recursos Prácticos

Este módulo incluye ejercicios para:
- Crear y gestionar namespaces
- Configurar ResourceQuotas y LimitRanges
- Implementar RBAC por namespace
- Probar comunicación inter-namespace
- Simular multitenencia

## Referencias

- [Documentación Oficial - Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
- [ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
- [LimitRanges](https://kubernetes.io/docs/concepts/policy/limit-range/)
- [RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
