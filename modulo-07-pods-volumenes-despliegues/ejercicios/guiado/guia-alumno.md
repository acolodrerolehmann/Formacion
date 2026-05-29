# Ejercicio guiado · Desplegando una Aplicación con Estado

## Objetivo
En este ejercicio vas a:

1. Crear un Pod manualmente.
2. Crear un `PersistentVolume` y un `PersistentVolumeClaim`.
3. Desplegar MySQL con un `StatefulSet`.
4. Verificar que los datos persisten tras reiniciar el pod.
5. Crear un `DaemonSet` para un agente de logging.
6. Crear un `Deployment` con `HorizontalPodAutoscaler`.
7. Forzar carga para ver el escalado automático.

> Nota: los manifiestos usan `hostPath`, pensado para un laboratorio local de un nodo.

## Requisitos
- Un cluster Kubernetes operativo.
- `kubectl` configurado.
- `metrics-server` instalado para probar el HPA.
- Trabajar desde `modulo-07-pods-volumenes-despliegues/ejercicios/guiado/`.

## Archivos del ejercicio
- `manifests/namespace.yaml`
- `manifests/manual-pod.yaml`
- `manifests/mysql-storage.yaml`
- `manifests/mysql-statefulset.yaml`
- `manifests/fluentd-daemonset.yaml`
- `manifests/web-hpa.yaml`
- `manifests/load-generator.yaml`

---

## Paso 1. Crear el namespace de trabajo
Aplica el namespace para aislar todos los recursos del ejercicio.

```bash
kubectl apply -f manifests/namespace.yaml
kubectl get ns modulo-07-guiado
```

**Qué hace:** crea un espacio aislado para no mezclar recursos con otros ejercicios.

**Resultado esperado:** el namespace `modulo-07-guiado` aparece con estado `Active`.

---

## Paso 2. Crear un pod manual
Ahora crea un pod simple con NGINX.

```bash
kubectl apply -f manifests/manual-pod.yaml
kubectl get pods -n modulo-07-guiado
kubectl describe pod web-manual -n modulo-07-guiado
```

**Qué hace:** crea un único pod sin ningún controlador encima.

**Resultado esperado:** el pod `web-manual` queda en estado `Running`.

**Comprueba los logs:**
```bash
kubectl logs web-manual -n modulo-07-guiado
```

**Idea clave:** si borras este pod, Kubernetes no lo recrea porque no está gestionado por un Deployment ni por otro controlador.

---

## Paso 3. Crear almacenamiento persistente
Aplica el `PersistentVolume` y el `PersistentVolumeClaim`.

```bash
kubectl apply -f manifests/mysql-storage.yaml
kubectl get pv
kubectl get pvc -n modulo-07-guiado
kubectl describe pvc mysql-pvc -n modulo-07-guiado
```

**Qué hace:**
- El `PersistentVolume` ofrece 2 GiB de almacenamiento.
- El `PersistentVolumeClaim` reserva 1 GiB para MySQL.

**Resultado esperado:** el PVC `mysql-pvc` debe quedar en estado `Bound`.

---

## Paso 4. Desplegar MySQL con StatefulSet
Aplica el servicio headless y el StatefulSet.

```bash
kubectl apply -f manifests/mysql-statefulset.yaml
kubectl get statefulset,svc,pods -n modulo-07-guiado
kubectl rollout status statefulset/mysql -n modulo-07-guiado
```

**Qué hace:**
- Crea un `Service` headless para el StatefulSet.
- Despliega MySQL con identidad estable: `mysql-0`.
- Monta el PVC en `/var/lib/mysql`.

**Resultado esperado:**
- El pod `mysql-0` queda en `Running`.
- El StatefulSet `mysql` queda listo con `1/1` réplicas.

**Comprueba la conectividad:**
```bash
kubectl exec -n modulo-07-guiado mysql-0 -- mysql -uroot -pformacion123 -e "SHOW DATABASES;"
```

---

## Paso 5. Insertar datos en MySQL
Crea una base de datos, una tabla y un registro.

```bash
kubectl exec -n modulo-07-guiado mysql-0 -- \
  mysql -uroot -pformacion123 -e "CREATE DATABASE IF NOT EXISTS curso; USE curso; CREATE TABLE IF NOT EXISTS alumnos (id INT PRIMARY KEY, nombre VARCHAR(50)); INSERT INTO alumnos VALUES (1,'ana') ON DUPLICATE KEY UPDATE nombre='ana'; SELECT * FROM alumnos;"
```

**Qué hace:** guarda un dato real dentro del volumen persistente de MySQL.

**Resultado esperado:** debe mostrarse una fila con `1` y `ana`.

---

## Paso 6. Verificar persistencia tras reiniciar el pod
Borra el pod del StatefulSet y deja que Kubernetes lo recree.

```bash
kubectl delete pod mysql-0 -n modulo-07-guiado
kubectl get pods -n modulo-07-guiado -w
```

Cuando el pod vuelva a estar en `Running`, consulta los datos otra vez:

```bash
kubectl exec -n modulo-07-guiado mysql-0 -- \
  mysql -uroot -pformacion123 -e "USE curso; SELECT * FROM alumnos;"
```

**Qué hace:** comprueba que el dato no estaba en el contenedor, sino en el volumen.

**Resultado esperado:** la fila sigue existiendo después del reinicio del pod.

---

## Paso 7. Crear un DaemonSet para logging
Aplica el manifiesto de Fluentd.

```bash
kubectl apply -f manifests/fluentd-daemonset.yaml
kubectl get daemonset -n modulo-07-guiado
kubectl get pods -n modulo-07-guiado -l app=fluentd -o wide
kubectl describe daemonset fluentd -n modulo-07-guiado
```

**Qué hace:** despliega un pod de Fluentd en cada nodo del cluster.

**Resultado esperado:** el número de pods del DaemonSet coincide con el número de nodos programables.

**Comprueba un pod del DaemonSet:**
```bash
kubectl logs -n modulo-07-guiado -l app=fluentd --tail=20
```

---

## Paso 8. Crear un Deployment con HPA
Aplica el Deployment, el Service y el HPA.

```bash
kubectl apply -f manifests/web-hpa.yaml
kubectl get deployment,svc,hpa -n modulo-07-guiado
kubectl rollout status deployment/web-hpa -n modulo-07-guiado
```

**Qué hace:**
- El `Deployment` levanta una app web stateless.
- El `Service` la expone dentro del cluster.
- El `HPA` escala entre 1 y 5 réplicas según el uso de CPU.

**Resultado esperado:**
- `deployment/web-hpa` listo.
- `service/web-hpa` creado.
- `hpa/web-hpa` visible.

**Si el HPA muestra `<unknown>`:** falta `metrics-server` o todavía no hay métricas.

---

## Paso 9. Generar carga para activar el HPA
Aplica un pod que lanza peticiones continuamente a la aplicación.

```bash
kubectl apply -f manifests/load-generator.yaml
kubectl get hpa -n modulo-07-guiado -w
```

En otra terminal, observa el número de réplicas:

```bash
kubectl get pods -n modulo-07-guiado -l app=web-hpa -w
```

**Qué hace:** aumenta el consumo de CPU del Deployment para que el HPA decida escalar.

**Resultado esperado:**
- El porcentaje de CPU sube.
- Las réplicas del Deployment aumentan progresivamente.

Puedes ver el detalle completo así:

```bash
kubectl describe hpa web-hpa -n modulo-07-guiado
kubectl get deployment web-hpa -n modulo-07-guiado
```

---

## Paso 10. Detener la carga y observar el descenso
Elimina el generador de carga:

```bash
kubectl delete -f manifests/load-generator.yaml
kubectl get hpa -n modulo-07-guiado -w
```

**Qué hace:** reduce el tráfico y permite que el HPA baje el número de réplicas.

**Resultado esperado:** pasado un tiempo, el Deployment vuelve hacia el mínimo configurado.

---

## Limpieza final
Cuando termines, elimina todos los recursos del ejercicio:

```bash
kubectl delete -f manifests/load-generator.yaml --ignore-not-found
kubectl delete -f manifests/web-hpa.yaml --ignore-not-found
kubectl delete -f manifests/fluentd-daemonset.yaml --ignore-not-found
kubectl delete -f manifests/mysql-statefulset.yaml --ignore-not-found
kubectl delete -f manifests/mysql-storage.yaml --ignore-not-found
kubectl delete -f manifests/manual-pod.yaml --ignore-not-found
kubectl delete -f manifests/namespace.yaml --ignore-not-found
```

## Resumen
En este ejercicio has usado cuatro patrones distintos:
- **Pod** para ejecución simple.
- **StatefulSet** para una app con datos persistentes.
- **DaemonSet** para un agente en todos los nodos.
- **Deployment + HPA** para una app stateless con escalado automático.
