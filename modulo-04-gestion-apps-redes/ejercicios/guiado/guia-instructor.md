# Ejercicio Guiado: Desplegando una App con Helm y Configurando Ingress

## Guía del Instructor

### Preparación
- Verificar que los alumnos tienen Helm instalado (`helm version`)
- Tener un clúster kind/minikube con ingress controller instalado

### Pasos

1. **Instalar un chart con Helm**
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm repo update
   helm install mi-nginx bitnami/nginx --set service.type=ClusterIP
   > Explicar: repos, charts, releases, values

2. **Inspeccionar la release**
   helm list
   helm status mi-nginx
   kubectl get all -l app.kubernetes.io/instance=mi-nginx
   > Explicar: cómo Helm gestiona el ciclo de vida

3. **Aplicar Network Policy**
   kubectl apply -f manifests/network-policy.yaml
   > Explicar: ingress/egress, podSelector, reglas

4. **Crear Ingress**
   kubectl apply -f manifests/ingress.yaml
   > Explicar: host, paths, backend services

5. **Rolling Update**
   helm upgrade mi-nginx bitnami/nginx --set image.tag=1.25
   kubectl rollout status deployment mi-nginx
   > Explicar: rolling update vs recreate

6. **Rollback**
   helm history mi-nginx
   helm rollback mi-nginx 1
   > Explicar: revisiones y rollback

7. **Explicar: Operadores y CRDs (teoría, sin ejercicio)**

   > Explicar antes de la limpieza. No se ejecuta nada, solo conceptos.

   **CRDs (Custom Resource Definitions):**
   - Extienden la API de Kubernetes con tipos de recurso propios
   - Ejemplo: un recurso `Database` que define motor, tamaño, backups
   - Se crean con `kubectl apply -f crd.yaml` y luego se usan como cualquier recurso nativo
   - Comando para ver CRDs existentes: `kubectl get crds`

   **Operadores:**
   - Son controladores que observan CRDs y ejecutan lógica de negocio
   - Automatizan tareas complejas: backups, upgrades, failover de bases de datos
   - Ejemplo: el operador de PostgreSQL crea réplicas, configura streaming replication y ejecuta backups automáticos
   - Patrón: CRD define el "qué quiero" → Operador implementa el "cómo se hace"
   - Catálogo: [OperatorHub.io](https://operatorhub.io)

   > Preguntar: "¿Qué tareas repetitivas hacéis manualmente hoy que un operador podría automatizar?"

8. **Limpieza**
   helm uninstall mi-nginx
   kubectl delete -f manifests/
