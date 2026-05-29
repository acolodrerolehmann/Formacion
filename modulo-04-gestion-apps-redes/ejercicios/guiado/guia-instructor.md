# Ejercicio Guiado: Desplegando una App con Helm y Configurando Ingress

## Guía del Instructor

### Preparación
- Verificar que los alumnos tienen Helm instalado (`helm version`)
- Tener un clúster kind/minikube con ingress controller instalado

### Pasos

1. **Instalar un chart con Helm**
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm repo update
   helm install mi-nginx bitnami/nginx --set service.type=ClusterIP
   ```
   > Explicar: repos, charts, releases, values

2. **Inspeccionar la release**
   ```bash
   helm list
   helm status mi-nginx
   kubectl get all -l app.kubernetes.io/instance=mi-nginx
   ```
   > Explicar: cómo Helm gestiona el ciclo de vida

3. **Aplicar Network Policy**
   ```bash
   kubectl apply -f manifests/network-policy.yaml
   ```
   > Explicar: ingress/egress, podSelector, reglas

4. **Crear Ingress**
   ```bash
   kubectl apply -f manifests/ingress.yaml
   ```
   > Explicar: host, paths, backend services

5. **Rolling Update**
   ```bash
   helm upgrade mi-nginx bitnami/nginx --set image.tag=1.25
   kubectl rollout status deployment mi-nginx
   ```
   > Explicar: rolling update vs recreate

6. **Rollback**
   ```bash
   helm history mi-nginx
   helm rollback mi-nginx 1
   ```
   > Explicar: revisiones y rollback

7. **Limpieza**
   ```bash
   helm uninstall mi-nginx
   kubectl delete -f manifests/
   ```
