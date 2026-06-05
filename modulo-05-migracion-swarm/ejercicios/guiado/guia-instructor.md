# Ejercicio Guiado: Migrando un docker-compose a Kubernetes con Kompose

## Guía del Instructor

### Preparación
- Verificar que los alumnos tienen `kompose` instalado o acceso a los manifests ya generados
- Tener un clúster local funcionando

### Pasos

1. **Revisar el docker-compose.yaml**
   cat manifests/docker-compose.yaml
   > Explicar: servicios web + redis, puertos, dependencias

2. **Convertir con Kompose (demostración)**
   kompose convert -f manifests/docker-compose.yaml
   > Explicar: qué genera kompose, limitaciones, qué ajustar manualmente

3. **Revisar manifests generados**
   cat manifests/web-deployment.yaml
   cat manifests/web-service.yaml
   cat manifests/redis-deployment.yaml
   cat manifests/redis-service.yaml
   > Explicar: mapeo compose → K8s (services, ports, environment)

4. **Aplicar al clúster**
   kubectl apply -f manifests/web-deployment.yaml
   kubectl apply -f manifests/web-service.yaml
   kubectl apply -f manifests/redis-deployment.yaml
   kubectl apply -f manifests/redis-service.yaml

5. **Verificar**
   kubectl get pods
   kubectl get services
   kubectl logs -l app=web
   > Explicar: verificación de comunicación entre servicios

6. **Discusión**
   > Puntos a tratar:
   > - Qué hace bien kompose (mapeo básico)
   > - Qué necesita ajuste manual (volúmenes, health checks, resources)
   > - Cuándo NO usar kompose (apps complejas)

7. **Limpieza**
   kubectl delete -f manifests/web-deployment.yaml -f manifests/web-service.yaml
   kubectl delete -f manifests/redis-deployment.yaml -f manifests/redis-service.yaml
