# Ejercicio 3: Extraer configuración a ConfigMaps y Secrets

## Escenario

Tu equipo ha desplegado una API REST (`order-api`) que se conecta a una base de datos PostgreSQL. El desarrollador que hizo el despliegue original puso **toda la configuración directamente en el Deployment**, incluyendo las credenciales de la base de datos.

El equipo de seguridad ha detectado el problema en una auditoría: las contraseñas están visibles en Git y en el clúster para cualquiera con acceso de lectura.

Tu tarea: **refactorizar** el despliegue para separar correctamente la configuración.

## Archivos

- `manifests/deployment.yaml` — Deployment con configuración hardcodeada (contiene TODO/FIX)
- `manifests/configmap.yaml` — ConfigMap a completar
- `manifests/secret.yaml` — Secret a completar

## Tareas

1. Examina `manifests/deployment.yaml` y identifica qué valores son sensibles y cuáles no
2. Completa `manifests/configmap.yaml` con los datos **no sensibles** (host, puerto, nombre de DB, etc.)
3. Completa `manifests/secret.yaml` con los datos **sensibles** (usuario y contraseña)
4. Modifica `manifests/deployment.yaml` para que use el ConfigMap y Secret en vez de valores hardcodeados

## Pistas

- Los datos no sensibles son: `DB_HOST`, `DB_PORT`, `DB_NAME`, `APP_PORT`, `LOG_LEVEL`
- Los datos sensibles son: `DB_USER`, `DB_PASSWORD`
- Puedes usar `envFrom` para inyectar todo el ConfigMap, o `valueFrom` para claves individuales
- En el Secret puedes usar `stringData` (texto plano) en vez de `data` (base64)
- Recuerda: el Deployment debe referenciar los nombres correctos de ConfigMap y Secret

## Validación

# Aplica los tres manifiestos
kubectl apply -f manifests/ -n default

# Verifica que el pod arranca correctamente
kubectl get pods -l app=order-api

# Comprueba que las variables están disponibles
POD=$(kubectl get pod -l app=order-api -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD -- env | grep -E "DB_|APP_|LOG_"

**Resultado esperado:**
- El pod está en estado `Running`
- Las variables de entorno están disponibles con los valores correctos
- `DB_PASSWORD` NO aparece en el manifiesto del Deployment
- El Secret contiene las credenciales codificadas en base64:
  kubectl get secret order-api-credentials -o yaml
