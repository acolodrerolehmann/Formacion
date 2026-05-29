# Módulo 4: Gestión de Aplicaciones, Redes y Extensibilidad

## Objetivos

- Empaquetar y desplegar aplicaciones con Helm
- Automatizar operaciones complejas mediante operadores
- Implementar políticas de red y seguridad en Kubernetes
- Exponer servicios con Ingress y configurar controladores
- Ejecutar actualizaciones seguras y reversibles de aplicaciones
- Extender Kubernetes con Custom Resources (CRDs) y operadores

## Conceptos Clave

### Helm y Operadores

**Helm** es el gestor de paquetes de Kubernetes. Utiliza **charts** (plantillas reutilizables) que contienen manifiestos YAML parametrizados. Los **values** personalizan los despliegues sin modificar el chart base, y las **releases** son instancias de charts en el clúster.

Estructura básica:
```
my-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

Los **operadores** automatizar tareas complejas del ciclo de vida de aplicaciones. Extienden Kubernetes con lógica específica (ej: backup automático, escalado inteligente, mantenimiento de bases de datos) usando CRDs y controllers.

### Redes y Network Policies

Kubernetes utiliza un modelo de red **plano**: cada pod recibe una IP única accesible desde cualquier punto del clúster. Por defecto, todos los pods pueden comunicarse entre sí.

Las **Network Policies** actúan como firewalls a nivel de pod, controlando el tráfico de entrada (ingress) y salida (egress). Se aplican por etiquetas y espacios de nombres:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

**Nota**: Las políticas requieren un plugin CNI que las soporte (Calico, Cilium, Weave, etc.).

### Ingress

Un **Ingress** expone rutas HTTP/HTTPS desde fuera del clúster a servicios internos. Permite host virtual, rutas por URL, terminación TLS y balanceo de carga.

El **controlador de Ingress** (NGINX, Traefik, HAProxy) implementa las reglas. Típicamente se ejecuta como un pod con un `NodePort` o `LoadBalancer`.

### Estrategias de Actualización

- **Rolling Update**: reemplaza pods gradualmente. Permite cero downtime.
- **Canary**: envía pequeño porcentaje de tráfico a la nueva versión antes de cambiar completamente.
- **Blue-Green**: mantiene dos versiones completas; cambia el tráfico instantáneamente.

Los **rollbacks** revierten a versiones anteriores automáticamente si las comprobaciones de salud fallan. Los `Deployment` mantienen un historial de revisiones.

### CRDs (Custom Resource Definitions)

Los CRDs extienden la API de Kubernetes con tipos de recurso personalizados. Permiten crear objetos como:

```yaml
apiVersion: example.com/v1
kind: Database
metadata:
  name: my-db
spec:
  engine: postgresql
  storage: 10Gi
```

Los CRDs son la base para crear operadores: un controller observa cambios en tus recursos personalizados y ejecuta lógica para mantener el estado deseado.

## Comandos Útiles

### Helm
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm search repo postgresql
helm install my-release bitnami/postgresql --values values.yaml
helm upgrade my-release bitnami/postgresql --set persistence.size=20Gi
helm rollback my-release
helm list -A
```

### Network Policies
```bash
kubectl apply -f network-policy.yaml
kubectl get networkpolicies -n production
kubectl describe networkpolicy deny-all-ingress
```

### Ingress
```bash
kubectl apply -f ingress.yaml
kubectl get ingress
kubectl describe ingress my-ingress
kubectl edit ingress my-ingress
```

### Despliegues
```bash
kubectl set image deployment/app app=myapp:v2
kubectl rollout status deployment/app
kubectl rollout history deployment/app
kubectl rollout undo deployment/app --to-revision=1
```

### CRDs
```bash
kubectl get crds
kubectl get <custom-resource> -o yaml
kubectl apply -f custom-resource.yaml
kubectl delete <custom-resource> my-resource
```

## Referencias

- [Documentación oficial de Kubernetes - Helm, Networking, Ingress, Deployments, CRDs](https://kubernetes.io/docs/)
- [Helm Official Documentation](https://helm.sh/docs/)
- [Kubernetes Operators Guide](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [Ingress Controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)

---

**Módulo anterior**: [Módulo 3 - Almacenamiento](../modulo-03-almacenamiento/)

**Siguiente módulo**: [Módulo 5 - Monitoreo y Logging](../modulo-05-monitoreo-logging/)
