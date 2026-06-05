# Módulo 4: Gestión de Aplicaciones, Redes y Extensibilidad

## Objetivos

- Gestionar configuración de aplicaciones con ConfigMaps y Secrets
- Inyectar variables de entorno de forma segura y mantenible
- Empaquetar y desplegar aplicaciones con Helm
- Automatizar operaciones complejas mediante operadores
- Implementar políticas de red y seguridad en Kubernetes
- Exponer servicios con Ingress y configurar controladores
- Ejecutar actualizaciones seguras y reversibles de aplicaciones
- Extender Kubernetes con Custom Resources (CRDs) y operadores

## Conceptos Clave

### ConfigMaps, Secrets y Variables de Entorno

En Docker/Swarm estáis acostumbrados a pasar configuración con `environment:` en compose o `docker secret`. Kubernetes tiene un sistema más potente y estructurado: **ConfigMaps** para datos no sensibles y **Secrets** para datos sensibles.

#### El problema: configuración hardcodeada

# ❌ MAL: Todo hardcodeado en el Deployment
containers:
- name: api
  image: mi-api:1.0
  env:
  - name: DB_HOST
    value: "postgres.prod.svc"
  - name: DB_PORT
    value: "5432"
  - name: DB_USER
    value: "admin"
  - name: DB_PASSWORD
    value: "SuperSecret123!"   # ← contraseña visible en el YAML

Problemas:
- Las credenciales quedan en el manifiesto (y en Git)
- Para cambiar un valor hay que redesplegar
- No se puede reutilizar la misma configuración entre entornos

#### ConfigMap: configuración no sensible

Un **ConfigMap** almacena pares clave-valor o ficheros completos de configuración:

apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  DB_HOST: "postgres.prod.svc"
  DB_PORT: "5432"
  LOG_LEVEL: "info"
  # También puede contener ficheros completos:
  nginx.conf: |
    server {
      listen 80;
      location / { proxy_pass http://localhost:3000; }
    }

#### Secret: datos sensibles

Un **Secret** es similar a un ConfigMap pero para datos que requieren protección:

apiVersion: v1
kind: Secret
metadata:
  name: api-credentials
type: Opaque
stringData:        # stringData acepta texto plano (K8s lo codifica automáticamente)
  DB_USER: "admin"
  DB_PASSWORD: "SuperSecret123!"

**Diferencias con ConfigMap:**
| Aspecto | ConfigMap | Secret |
|---------|-----------|--------|
| Datos | No sensibles | Sensibles (contraseñas, tokens, certificados) |
| Almacenamiento | Texto plano en etcd | Base64 en etcd (opcionalmente encriptado at-rest) |
| Acceso | Cualquier pod puede leerlos | Se puede restringir con RBAC |
| Tamaño máximo | 1 MB | 1 MB |
| Montaje en memoria | Opcional | Se recomienda usar `tmpfs` (no toca disco del nodo) |

**Equivalencia con Swarm:**
| Docker Swarm | Kubernetes |
|---|---|
| `docker config create` | `kubectl create configmap` |
| `docker secret create` | `kubectl create secret` |
| `environment:` en compose | `env:` en container spec |

#### Inyección en Pods: tres formas

**1. Variables individuales con `valueFrom`:**
containers:
- name: api
  env:
  - name: DB_HOST
    valueFrom:
      configMapKeyRef:
        name: api-config
        key: DB_HOST
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: api-credentials
        key: DB_PASSWORD

**2. Inyectar todo el ConfigMap/Secret con `envFrom`:**
containers:
- name: api
  envFrom:
  - configMapRef:
      name: api-config       # Todas las claves → env vars
  - secretRef:
      name: api-credentials  # Todas las claves → env vars

**3. Montar como fichero (volumen):**
containers:
- name: nginx
  volumeMounts:
  - name: config-vol
    mountPath: /etc/nginx/nginx.conf
    subPath: nginx.conf
volumes:
- name: config-vol
  configMap:
    name: api-config

> **Caso de uso:** Ficheros de configuración completos (nginx.conf, application.properties, .env) se montan como volumen. Variables simples se inyectan como env vars.

#### Buenas prácticas

1. **Nunca hardcodear secrets en manifiestos** — usar siempre objetos Secret
2. **RBAC para Secrets** — limitar qué ServiceAccounts pueden leer secrets
3. **Encriptación at-rest** — habilitar `EncryptionConfiguration` en el API Server
4. **Separar por entorno** — un ConfigMap/Secret por entorno (dev/staging/prod)
5. **Inmutabilidad** — usar `immutable: true` para evitar cambios accidentales en producción
6. **No commitear secrets en Git** — usar herramientas como Sealed Secrets, SOPS o Vault

### Helm y Operadores

**Helm** es el gestor de paquetes de Kubernetes. Utiliza **charts** (plantillas reutilizables) que contienen manifiestos YAML parametrizados. Los **values** personalizan los despliegues sin modificar el chart base, y las **releases** son instancias de charts en el clúster.

Estructura básica:
my-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml

Los **operadores** automatizar tareas complejas del ciclo de vida de aplicaciones. Extienden Kubernetes con lógica específica (ej: backup automático, escalado inteligente, mantenimiento de bases de datos) usando CRDs y controllers.

### Redes y Network Policies

Kubernetes utiliza un modelo de red **plano**: cada pod recibe una IP única accesible desde cualquier punto del clúster. Por defecto, todos los pods pueden comunicarse entre sí.

Las **Network Policies** actúan como firewalls a nivel de pod, controlando el tráfico de entrada (ingress) y salida (egress). Se aplican por etiquetas y espacios de nombres:

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress

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

apiVersion: example.com/v1
kind: Database
metadata:
  name: my-db
spec:
  engine: postgresql
  storage: 10Gi

Los CRDs son la base para crear operadores: un controller observa cambios en tus recursos personalizados y ejecuta lógica para mantener el estado deseado.

## Comandos Útiles

### ConfigMaps y Secrets
# Crear ConfigMap desde literales
kubectl create configmap app-config --from-literal=DB_HOST=postgres --from-literal=DB_PORT=5432

# Crear ConfigMap desde fichero
kubectl create configmap nginx-config --from-file=nginx.conf

# Crear Secret desde literales
kubectl create secret generic db-credentials --from-literal=DB_USER=admin --from-literal=DB_PASSWORD=s3cr3t

# Ver contenido de un ConfigMap
kubectl get configmap app-config -o yaml

# Ver contenido de un Secret (decodificado)
kubectl get secret db-credentials -o jsonpath='{.data.DB_PASSWORD}' | base64 -d

# Verificar env vars dentro de un pod
kubectl exec mi-pod -- env | grep DB_

### Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm search repo postgresql
helm install my-release bitnami/postgresql --values values.yaml
helm upgrade my-release bitnami/postgresql --set persistence.size=20Gi
helm rollback my-release
helm list -A

### Network Policies
kubectl apply -f network-policy.yaml
kubectl get networkpolicies -n production
kubectl describe networkpolicy deny-all-ingress

### Ingress
kubectl apply -f ingress.yaml
kubectl get ingress
kubectl describe ingress my-ingress
kubectl edit ingress my-ingress

### Despliegues
kubectl set image deployment/app app=myapp:v2
kubectl rollout status deployment/app
kubectl rollout history deployment/app
kubectl rollout undo deployment/app --to-revision=1

### CRDs
kubectl get crds
kubectl get <custom-resource> -o yaml
kubectl apply -f custom-resource.yaml
kubectl delete <custom-resource> my-resource

## Referencias

- [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Inyectar datos en Pods con env vars](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)
- [Documentación oficial de Kubernetes - Helm, Networking, Ingress, Deployments, CRDs](https://kubernetes.io/docs/)
- [Helm Official Documentation](https://helm.sh/docs/)
- [Kubernetes Operators Guide](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [Ingress Controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)

---

**Módulo anterior**: [Módulo 3 - Almacenamiento](../modulo-03-almacenamiento/)

**Siguiente módulo**: [Módulo 5 - Monitoreo y Logging](../modulo-05-monitoreo-logging/)
