# Guía del alumno

## Objetivo

Explorar componentes básicos del clúster y practicar con Pods, labels, selectors, ReplicaSets, Services y APIs.

## Requisitos

- `kubectl` instalado.
- Un contexto activo apuntando a un clúster funcional.

## Directorio de trabajo

Ejecuta todo desde este directorio:

```bash
cd /Users/andres/Formacion/modulo-02-componentes-arquitectura/ejercicios/guiado
```

---

## Paso 1. Inspecciona los nodos del clúster

**Comando**

```bash
kubectl get nodes -o wide
```

**Qué hace**

Lista los nodos del clúster con más detalle: rol, versión, IP interna y runtime.

**Salida esperada**

- Al menos un nodo en estado `Ready`.
- Columnas como `NAME`, `STATUS`, `ROLES`, `VERSION`, `INTERNAL-IP`.
- En un laboratorio pequeño puede aparecer un solo nodo.

---

## Paso 2. Revisa los pods del namespace `kube-system`

**Comando**

```bash
kubectl get pods -n kube-system -o wide
```

**Qué hace**

Muestra los pods que forman parte del funcionamiento base del clúster.

**Salida esperada**

- Verás pods como `coredns`, `kube-proxy`, `metrics-server` u otros.
- La mayoría deberían estar en `Running`.
- En clústeres gestionados puede que no aparezcan los componentes del control plane como pods visibles.

---

## Paso 3. Crea un Pod con labels

**Comandos**

```bash
kubectl apply -f manifests/01-pod-labels.yaml
kubectl get pod pod-etiquetas --show-labels
```

**Qué hace**

Crea un Pod simple basado en `nginx` y muestra sus etiquetas.

**Salida esperada**

- Mensaje similar a `pod/pod-etiquetas created`.
- Un Pod llamado `pod-etiquetas`.
- Labels visibles como `app=pod-demo`, `curso=kubernetes`, `modulo=arquitectura`.

---

## Paso 4. Usa selectors para localizar el Pod

**Comandos**

```bash
kubectl get pods -l app=pod-demo --show-labels
kubectl get pods -l curso=kubernetes,modulo=arquitectura
```

**Qué hace**

Filtra recursos por labels. El segundo comando combina dos condiciones.

**Salida esperada**

- Ambos comandos deben devolver el Pod `pod-etiquetas`.
- Con `--show-labels` verás las etiquetas completas asociadas al recurso.

---

## Paso 5. Crea un ReplicaSet

**Comandos**

```bash
kubectl apply -f manifests/02-replicaset-web.yaml
kubectl get rs rs-demo-web
kubectl get pods -l app=rs-demo -o wide
```

**Qué hace**

Crea un ReplicaSet con 2 réplicas de `nginx` y lista los Pods que controla.

**Salida esperada**

- Mensaje similar a `replicaset.apps/rs-demo-web created`.
- El ReplicaSet debería mostrar `DESIRED 2`, `CURRENT 2` y `READY 2` tras unos segundos.
- Aparecerán dos Pods con nombres que empiezan por `rs-demo-web-`.

---

## Paso 6. Comprueba cómo mantiene el estado deseado

Abre una segunda terminal en el mismo directorio.

**Terminal A**

```bash
kubectl get pods -l app=rs-demo -w
```

**Terminal B**

1. Lista los Pods actuales:

   ```bash
   kubectl get pods -l app=rs-demo
   ```

2. Elimina uno de ellos:

   ```bash
   kubectl delete pod <nombre-de-un-pod-del-rs>
   ```

**Qué hace**

El ReplicaSet detecta que falta una réplica y crea otra automáticamente.

**Salida esperada**

- Verás el Pod eliminado pasar a `Terminating`.
- Poco después aparecerá un Pod nuevo con otro nombre.
- El total vuelve a ser 2 Pods en ejecución.

---

## Paso 7. Crea un Service para exponer el ReplicaSet

**Comandos**

```bash
kubectl apply -f manifests/03-service-web.yaml
kubectl get svc svc-rs-demo
kubectl get endpoints svc-rs-demo
```

**Qué hace**

Crea un `Service` de tipo `ClusterIP` que apunta a los Pods del ReplicaSet usando labels.

**Salida esperada**

- Mensaje similar a `service/svc-rs-demo created`.
- El Service tendrá una `CLUSTER-IP` estable y expondrá el puerto `80/TCP`.
- Los endpoints mostrarán las IPs de los Pods del ReplicaSet con el puerto `80`.

---

## Paso 8. Explora las APIs disponibles

**Comandos**

```bash
kubectl api-resources
kubectl api-resources | grep -E 'pods|replicasets|services'
```

**Qué hace**

Lista los recursos disponibles en la API de Kubernetes y filtra los más usados en este ejercicio.

**Salida esperada**

- Una tabla con columnas como `NAME`, `SHORTNAMES`, `APIVERSION`, `NAMESPACED`, `KIND`.
- `pods` y `services` aparecerán en `v1`.
- `replicasets` aparecerá en `apps/v1`.

---

## Paso 9. Limpia el entorno

**Comando**

```bash
kubectl delete -f manifests/
```

**Qué hace**

Elimina todos los recursos creados durante el ejercicio.

**Salida esperada**

- Mensajes `deleted` para el Pod, el ReplicaSet y el Service.
- Si repites el comando más tarde, puede aparecer `NotFound`.
