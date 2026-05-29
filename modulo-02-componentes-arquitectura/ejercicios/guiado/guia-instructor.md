# Guía del instructor

## Preparación

```bash
cd /Users/andres/Formacion/modulo-02-componentes-arquitectura/ejercicios/guiado
```

Verifica que `kubectl` apunta a un clúster funcional.

## Pasos

1. **Inspeccionar nodos**

   ```bash
   kubectl get nodes -o wide
   ```

   **Explicar:**
   - Diferencia entre control plane y worker.
   - Columnas clave: `STATUS`, `ROLES`, `VERSION`, `INTERNAL-IP`.
   - `-o wide` añade más contexto operativo.

2. **Explorar pods del sistema**

   ```bash
   kubectl get pods -n kube-system -o wide
   ```

   **Explicar:**
   - `kube-system` contiene componentes base del clúster.
   - Identificar `coredns`, `kube-proxy`, `metrics-server` u otros.
   - En clústeres gestionados puede no verse el control plane como pods.

3. **Crear un Pod con labels**

   ```bash
   kubectl apply -f manifests/01-pod-labels.yaml
   kubectl get pod pod-etiquetas --show-labels
   ```

   **Explicar:**
   - `metadata.labels` sirve para clasificar recursos.
   - Un Pod puede tener varias etiquetas simultáneamente.

4. **Buscar recursos con selectors**

   ```bash
   kubectl get pods -l app=pod-demo --show-labels
   kubectl get pods -l curso=kubernetes,modulo=arquitectura
   ```

   **Explicar:**
   - Selectors por igualdad.
   - Combinación de varias etiquetas para filtrar con precisión.

5. **Crear un ReplicaSet**

   ```bash
   kubectl apply -f manifests/02-replicaset-web.yaml
   kubectl get rs rs-demo-web
   kubectl get pods -l app=rs-demo -o wide
   ```

   **Explicar:**
   - `spec.replicas` define el estado deseado.
   - `selector.matchLabels` debe coincidir con las labels del template.
   - El ReplicaSet crea y mantiene los Pods.

6. **Demostrar desired state**

   **Terminal A**
   ```bash
   kubectl get pods -l app=rs-demo -w
   ```

   **Terminal B**
   ```bash
   kubectl delete pod <nombre-de-un-pod-del-rs>
   ```

   **Explicar:**
   - El controlador detecta la desviación.
   - Se crea un Pod nuevo con otro sufijo.
   - El objetivo no es conservar Pods, sino mantener réplicas.

7. **Exponer el ReplicaSet con un Service**

   ```bash
   kubectl apply -f manifests/03-service-web.yaml
   kubectl get svc svc-rs-demo
   kubectl get endpoints svc-rs-demo
   ```

   **Explicar:**
   - El Service da una IP estable a Pods cambiantes.
   - El selector del Service apunta a los Pods del ReplicaSet.
   - `endpoints` muestra los backends reales.

8. **Explorar APIs disponibles**

   ```bash
   kubectl api-resources
   kubectl api-resources | grep -E 'pods|replicasets|services'
   ```

   **Explicar:**
   - Distinguir `NAME`, `APIVERSION`, `NAMESPACED` y `KIND`.
   - `pods` y `services` usan `v1`; `replicasets` usa `apps/v1`.

9. **Limpiar recursos**

   ```bash
   kubectl delete -f manifests/
   ```

   **Explicar:**
   - Cerrar el ejercicio dejando el clúster limpio.
   - Si algún recurso ya no existe, Kubernetes lo indicará.
