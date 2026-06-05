# Ejercicio Guiado: ConfigMaps, Secrets y Variables de Entorno

## Guía del Instructor

### Objetivo

Demostrar por qué existen ConfigMaps y Secrets mostrando primero el problema (hardcoded) y después la solución correcta.

### Preparación

- Clúster kind/minikube funcionando
- Namespace limpio: `kubectl create namespace demo-config`

### Pasos

1. **Desplegar app con configuración hardcodeada**
   kubectl apply -f manifests/01-deployment-hardcoded.yaml -n demo-config
   > Explicar: Esta app tiene host, puerto, usuario y contraseña directamente en el YAML.

2. **Mostrar el problema: credenciales expuestas**
   kubectl get deployment api-hardcoded -n demo-config -o yaml | grep -A 20 "env:"
   > Preguntar a los alumnos: "¿Qué pasa si este YAML está en Git? ¿Y si alguien hace kubectl get?"
   > Respuesta: la contraseña es visible para cualquiera con acceso al clúster o al repo.

3. **Crear un ConfigMap para datos no sensibles**
   kubectl apply -f manifests/02-configmap.yaml -n demo-config
   kubectl get configmap api-config -n demo-config -o yaml
   > Explicar: ConfigMap almacena configuración reutilizable, separada del Deployment.

4. **Crear un Secret para credenciales**
   kubectl apply -f manifests/03-secret.yaml -n demo-config
   kubectl get secret api-credentials -n demo-config -o yaml
   > Mostrar: los valores están en base64. Preguntar: "¿Es suficiente?" → No, pero es la primera capa.
   > Explicar: RBAC + encryption at-rest + no-commit-en-Git completan la seguridad.

5. **Redesplegar usando ConfigMap y Secret**
   kubectl apply -f manifests/04-deployment-refactored.yaml -n demo-config
   > Explicar: `envFrom` inyecta todas las claves. `valueFrom.secretKeyRef` referencia claves individuales.

6. **Verificar que funciona**
   POD=$(kubectl get pod -n demo-config -l app=api-refactored -o jsonpath='{.items[0].metadata.name}')
   kubectl exec $POD -n demo-config -- env | grep -E "DB_|LOG_"
   > Mostrar: las variables están disponibles dentro del contenedor.

7. **Montar ConfigMap como fichero de configuración**
   kubectl apply -f manifests/05-configmap-file.yaml -n demo-config
   kubectl apply -f manifests/06-deployment-volume.yaml -n demo-config
   > Explicar: Algunos programas leen config de fichero (nginx.conf, app.properties). Se monta como volumen.

8. **Verificar el fichero montado**
   POD=$(kubectl get pod -n demo-config -l app=nginx-configured -o jsonpath='{.items[0].metadata.name}')
   kubectl exec $POD -n demo-config -- cat /etc/nginx/conf.d/default.conf
   > Mostrar que el contenido del ConfigMap está como fichero dentro del contenedor.

9. **Limpieza**
   kubectl delete namespace demo-config

### Puntos clave a remarcar

- ConfigMap = configuración no sensible (hosts, puertos, feature flags)
- Secret = datos sensibles (contraseñas, tokens, certificados TLS)
- Tres formas de inyectar: `env` individual, `envFrom` masivo, volumen (fichero)
- Los Secrets en base64 NO son encriptación — necesitas RBAC + encryption at-rest
- Equivalencia Swarm: `docker config` → ConfigMap, `docker secret` → Secret
