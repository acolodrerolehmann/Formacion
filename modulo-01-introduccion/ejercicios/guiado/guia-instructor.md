# Guía del instructor · Tu primer Pod en Kubernetes

1. **Preparación**
   ```bash
   cd /Users/andres/Formacion/modulo-01-introduccion/ejercicios/guiado
   kubectl get nodes
   ```
   Nota: validar contexto y recordar que trabajaremos contra un clúster real.

2. **Presentar el manifiesto**
   ```bash
   cat manifests/primer-pod.yaml
   ```
   Manifiesto clave:
   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: primer-nginx
     labels:
       app: primer-nginx
   spec:
     containers:
       - name: nginx
         image: nginx:1.25
         ports:
           - containerPort: 80
   ```
   Nota: explicar `apiVersion`, `kind`, `metadata` y `spec`; Kubernetes recibe estado deseado.

3. **Crear el Pod de forma declarativa**
   ```bash
   kubectl apply -f manifests/primer-pod.yaml
   kubectl get pod primer-nginx
   ```
   Nota: remarcar que `apply` crea o reconcilia según el manifiesto.

4. **Inspección rápida**
   ```bash
   kubectl get pod primer-nginx -o wide
   kubectl describe pod primer-nginx
   ```
   Nota: revisar fase, IP, nodo asignado, contenedor y eventos.

5. **Ver logs del contenedor**
   ```bash
   kubectl logs primer-nginx
   ```
   Nota: `logs` muestra stdout/stderr del contenedor.

6. **Acceder con port-forward**
   ```bash
   kubectl port-forward pod/primer-nginx 8080:80
   ```
   Nota: dejar este terminal abierto; el puerto local 8080 apunta al puerto 80 del Pod.

7. **Probar desde otro terminal**
   ```bash
   curl -I http://127.0.0.1:8080
   kubectl logs primer-nginx
   ```
   Nota: mostrar respuesta HTTP 200 y luego la línea de acceso en el log.

8. **Mostrar el enfoque declarativo**
   ```bash
   kubectl apply -f manifests/primer-pod.yaml
   ```
   Nota: si el estado deseado no cambia, la salida será `unchanged`.

9. **Eliminar el recurso**
   ```bash
   kubectl delete -f manifests/primer-pod.yaml
   kubectl get pod primer-nginx
   ```
   Nota: al borrar el manifiesto del clúster, el estado deseado desaparece y el Pod se elimina.
