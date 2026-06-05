# Ejercicio Guiado: Desplegando una App con Helm y Configurando Ingress

## Guía del Alumno

### Objetivo
Aprender a desplegar aplicaciones con Helm, configurar políticas de red y exponer servicios con Ingress.

---

### Paso 1: Instalar un Chart con Helm

Helm es el gestor de paquetes de Kubernetes. Los "charts" son paquetes preconfigurados.

# Añadir el repositorio de Bitnami
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Instalar nginx como una release llamada "mi-nginx"
helm install mi-nginx bitnami/nginx --set service.type=ClusterIP

**Resultado esperado:** Mensaje de instalación exitosa con notas de la release.

---

### Paso 2: Inspeccionar la Release

# Ver todas las releases instaladas
helm list

# Ver el estado detallado
helm status mi-nginx

# Ver los recursos creados por Helm
kubectl get all -l app.kubernetes.io/instance=mi-nginx

**Resultado esperado:** Deployment, Service y Pods creados con labels de Helm.

---

### Paso 3: Aplicar una Network Policy

Las Network Policies controlan qué tráfico puede entrar o salir de los pods.

kubectl apply -f manifests/network-policy.yaml

# Verificar que se creó
kubectl get networkpolicy
kubectl describe networkpolicy allow-nginx-ingress

**Resultado esperado:** La policy permite solo tráfico HTTP (puerto 80) hacia los pods de nginx.

---

### Paso 4: Configurar Ingress

Ingress expone servicios HTTP/HTTPS al exterior del clúster.

kubectl apply -f manifests/ingress.yaml

# Verificar
kubectl get ingress
kubectl describe ingress mi-nginx-ingress

**Resultado esperado:** Ingress creado con regla para el host `mi-nginx.local`.

---

### Paso 5: Realizar un Rolling Update con Helm

# Actualizar la versión de la imagen
helm upgrade mi-nginx bitnami/nginx --set image.tag=1.25

# Observar el progreso del rolling update
kubectl rollout status deployment mi-nginx

# Ver los pods actualizándose
kubectl get pods -w

**Resultado esperado:** Los pods se actualizan gradualmente sin downtime.

---

### Paso 6: Rollback

Si algo sale mal, Helm permite volver a una versión anterior.

# Ver historial de revisiones
helm history mi-nginx

# Volver a la revisión 1
helm rollback mi-nginx 1

# Verificar que se revirtió
kubectl get pods -o jsonpath='{.items[0].spec.containers[0].image}'

**Resultado esperado:** La aplicación vuelve a la versión original.

---

### Paso 7: Limpieza

helm uninstall mi-nginx
kubectl delete -f manifests/

---

### Resumen

| Concepto | Comando clave |
|----------|--------------|
| Instalar chart | `helm install <nombre> <chart>` |
| Actualizar | `helm upgrade <nombre> <chart>` |
| Rollback | `helm rollback <nombre> <revisión>` |
| Network Policy | `kubectl apply -f network-policy.yaml` |
| Ingress | `kubectl apply -f ingress.yaml` |

### Referencias
- [Helm Docs](https://helm.sh/docs/)
- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
