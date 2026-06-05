# Ejercicio Guiado: ConfigMaps, Secrets y Variables de Entorno

## Guía del Alumno

### Objetivo

Aprender a separar la configuración del código usando ConfigMaps y Secrets en Kubernetes. Veremos primero cómo **no** hacerlo (hardcoded) y después la forma correcta.

---

### Paso 1: Preparar el namespace

kubectl create namespace demo-config

Trabajaremos en un namespace dedicado para mantener todo aislado.

---

### Paso 2: Desplegar con configuración hardcodeada (❌ MAL)

kubectl apply -f manifests/01-deployment-hardcoded.yaml -n demo-config

Inspecciona el manifiesto — verás que la contraseña de la base de datos está directamente en el YAML:

kubectl get deployment api-hardcoded -n demo-config -o yaml | grep -A 20 "env:"

**Resultado esperado:** Ves `DB_PASSWORD: "SuperSecret123!"` en texto plano.

**¿Por qué es un problema?**
- Si el YAML está en Git, cualquiera con acceso al repo ve la contraseña
- Cualquier usuario del clúster con permisos de lectura puede ver el Deployment
- Para cambiar la contraseña hay que modificar y redesplegar el Deployment

---

### Paso 3: Crear un ConfigMap

kubectl apply -f manifests/02-configmap.yaml -n demo-config

Verifica su contenido:

kubectl get configmap api-config -n demo-config -o yaml

**Resultado esperado:** Un objeto con datos no sensibles (host, puerto, log level) separados del Deployment.

---

### Paso 4: Crear un Secret

kubectl apply -f manifests/03-secret.yaml -n demo-config

Verifica su contenido:

kubectl get secret api-credentials -n demo-config -o yaml

**Resultado esperado:** Los valores aparecen codificados en base64.

Para decodificar un valor:

kubectl get secret api-credentials -n demo-config -o jsonpath='{.data.DB_PASSWORD}' | base64 -d

> **Nota:** Base64 no es encriptación. Es solo codificación. La seguridad real viene de RBAC (quién puede leer Secrets) y encryption at-rest en etcd.

---

### Paso 5: Redesplegar usando ConfigMap y Secret (✅ BIEN)

kubectl apply -f manifests/04-deployment-refactored.yaml -n demo-config

Este Deployment usa:
- `envFrom.configMapRef` → inyecta todas las claves del ConfigMap como variables de entorno
- `env.valueFrom.secretKeyRef` → inyecta claves individuales del Secret

---

### Paso 6: Verificar las variables dentro del pod

POD=$(kubectl get pod -n demo-config -l app=api-refactored -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD -n demo-config -- env | grep -E "DB_|LOG_"

**Resultado esperado:**
DB_HOST=postgres.prod.svc
DB_PORT=5432
LOG_LEVEL=info
DB_USER=admin
DB_PASSWORD=SuperSecret123!

Las variables están disponibles sin estar hardcodeadas en el Deployment.

---

### Paso 7: Montar un ConfigMap como fichero

Algunos programas leen su configuración de ficheros (nginx.conf, application.properties). Podemos montar un ConfigMap como volumen:

kubectl apply -f manifests/05-configmap-file.yaml -n demo-config
kubectl apply -f manifests/06-deployment-volume.yaml -n demo-config

---

### Paso 8: Verificar el fichero montado

POD=$(kubectl get pod -n demo-config -l app=nginx-configured -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD -n demo-config -- cat /etc/nginx/conf.d/default.conf

**Resultado esperado:** El contenido del ConfigMap aparece como fichero dentro del contenedor.

---

### Paso 9: Limpieza

kubectl delete namespace demo-config

---

### Resumen

| Método | Cuándo usarlo | Ejemplo |
|--------|---------------|---------|
| `env` con `value` | Solo para desarrollo rápido / pruebas | `value: "localhost"` |
| `envFrom` con ConfigMap | Inyectar toda la config no sensible | Hosts, puertos, feature flags |
| `valueFrom.secretKeyRef` | Credenciales individuales | Contraseñas, tokens API |
| Volumen con ConfigMap | Ficheros de configuración completos | nginx.conf, app.properties |

### Comparación con Docker Swarm

| Docker Swarm | Kubernetes |
|---|---|
| `environment:` en compose | `env:` en container spec |
| `docker config create` | `kubectl create configmap` |
| `docker secret create` | `kubectl create secret` |
| Montados en `/run/secrets/` | Montados donde quieras (volumeMounts) |
