# Guía del alumno · Tu primer Pod en Kubernetes

## Objetivo
Crear un Pod con NGINX, inspeccionarlo con `kubectl`, acceder a él con `port-forward` y eliminarlo entendiendo el enfoque declarativo de Kubernetes.

## Requisitos
- Tener acceso a un clúster de Kubernetes.
- Tener `kubectl` configurado.

## Pasos

1. **Entrar en el directorio del ejercicio y comprobar acceso al clúster**

   **Comando**
   ```bash
   cd /Users/andres/Formacion/modulo-01-introduccion/ejercicios/guiado
   kubectl get nodes
   ```

   **Qué hace**
   - Entra en la carpeta del ejercicio.
   - Pide al API Server la lista de nodos del clúster.

   **Por qué**
   Antes de crear recursos, conviene verificar que `kubectl` apunta al clúster correcto y que el clúster responde.

   **Salida esperada**
   ```text
   NAME           STATUS   ROLES           AGE   VERSION
   <nombre-nodo>  Ready    control-plane   ...   ...
   ```
   Los valores exactos pueden cambiar, pero al menos un nodo debe aparecer en estado `Ready`.

2. **Revisar el manifiesto del Pod**

   **Comando**
   ```bash
   cat manifests/primer-pod.yaml
   ```

   **Qué hace**
   Muestra el contenido del archivo YAML que describe el Pod.

   **Por qué**
   En Kubernetes normalmente trabajamos de forma declarativa: escribimos el estado deseado en un manifiesto y luego lo aplicamos.

   **Salida esperada**
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

3. **Crear el Pod con `kubectl apply`**

   **Comando**
   ```bash
   kubectl apply -f manifests/primer-pod.yaml
   ```

   **Qué hace**
   Envía al clúster el manifiesto y crea el recurso descrito en el archivo.

   **Por qué**
   `apply` es el comando típico cuando trabajamos con manifiestos. Si el recurso no existe, lo crea. Si ya existe, lo ajusta al estado definido en el YAML.

   **Salida esperada**
   ```text
   pod/primer-nginx created
   ```

4. **Comprobar el estado básico del Pod**

   **Comando**
   ```bash
   kubectl get pod primer-nginx
   ```

   **Qué hace**
   Consulta el estado resumido del Pod.

   **Por qué**
   Sirve para comprobar si el Pod ya está arrancando o si ha llegado a estado `Running`.

   **Salida esperada**
   ```text
   NAME           READY   STATUS              RESTARTS   AGE
   primer-nginx   1/1     Running             0          ...
   ```
   Justo después de crearlo también podrías ver `ContainerCreating`. Es normal durante unos segundos.

5. **Ver más detalle con salida amplia**

   **Comando**
   ```bash
   kubectl get pod primer-nginx -o wide
   ```

   **Qué hace**
   Muestra información adicional, como la IP del Pod y el nodo en el que está ejecutándose.

   **Por qué**
   Ayuda a entender que el Pod ya está programado en un nodo concreto del clúster.

   **Salida esperada**
   ```text
   NAME           READY   STATUS    RESTARTS   AGE   IP            NODE           ...
   primer-nginx   1/1     Running   0          ...   <ip-del-pod>  <nombre-nodo>  ...
   ```

6. **Inspeccionar el recurso en profundidad**

   **Comando**
   ```bash
   kubectl describe pod primer-nginx
   ```

   **Qué hace**
   Muestra una descripción extensa del Pod: metadatos, imagen, puertos, estado del contenedor y eventos.

   **Por qué**
   `describe` es una de las herramientas más útiles para diagnosticar qué está pasando con un recurso.

   **Salida esperada**
   Debes ver, entre otras, estas secciones:
   ```text
   Name:         primer-nginx
   Namespace:    default
   Status:       Running
   IP:           <ip-del-pod>
   Containers:
     nginx:
       Image:          nginx:1.25
       Port:           80/TCP
   Events:
     Type    Reason     Age   From               Message
     Normal  Scheduled  ...   default-scheduler  Successfully assigned ...
     Normal  Pulled     ...   kubelet            Container image "nginx:1.25" already present on machine
     Normal  Created    ...   kubelet            Created container nginx
     Normal  Started    ...   kubelet            Started container nginx
   ```

7. **Ver los logs del contenedor**

   **Comando**
   ```bash
   kubectl logs primer-nginx
   ```

   **Qué hace**
   Muestra la salida estándar del contenedor.

   **Por qué**
   Es la forma más directa de revisar qué ha escrito la aplicación sin entrar dentro del contenedor.

   **Salida esperada**
   Con la imagen oficial de NGINX normalmente verás líneas similares a estas:
   ```text
   /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
   /docker-entrypoint.sh: Configuration complete; ready for start up
   ```
   El contenido puede variar ligeramente según la versión de la imagen.

8. **Publicar temporalmente el puerto del Pod en tu equipo**

   **Comando**
   ```bash
   kubectl port-forward pod/primer-nginx 8080:80
   ```

   **Qué hace**
   Abre un túnel entre tu equipo y el Pod: el puerto local `8080` se redirige al puerto `80` del contenedor.

   **Por qué**
   Permite probar la aplicación sin crear un `Service`.

   **Salida esperada**
   ```text
   Forwarding from 127.0.0.1:8080 -> 80
   Forwarding from [::1]:8080 -> 80
   ```

   Deja este comando ejecutándose y abre otro terminal para el siguiente paso.

9. **Probar NGINX desde tu equipo**

   **Comando**
   ```bash
   curl -I http://127.0.0.1:8080
   ```

   **Qué hace**
   Envía una petición HTTP al puerto local que está reenviado al Pod.

   **Por qué**
   Confirma que la aplicación dentro del Pod responde correctamente.

   **Salida esperada**
   ```text
   HTTP/1.1 200 OK
   Server: nginx/1.25.x
   Date: ...
   Content-Type: text/html
   ```

10. **Revisar los logs después de acceder a la aplicación**

    **Comando**
    ```bash
    kubectl logs primer-nginx
    ```

    **Qué hace**
    Vuelve a consultar los logs del contenedor.

    **Por qué**
    Ahora deberían aparecer registros de acceso generados por la petición hecha con `curl`.

    **Salida esperada**
    Además de las líneas de arranque, verás una línea similar a esta:
    ```text
    127.0.0.1 - - [..] "HEAD / HTTP/1.1" 200 0 "-" "curl/..."
    ```

11. **Demostrar el enfoque declarativo**

    **Comando**
    ```bash
    kubectl apply -f manifests/primer-pod.yaml
    ```

    **Qué hace**
    Vuelve a aplicar exactamente el mismo manifiesto.

    **Por qué**
    Si el archivo no ha cambiado, el estado deseado sigue siendo el mismo. Kubernetes detecta que no hay nada que modificar.

    **Salida esperada**
    ```text
    pod/primer-nginx unchanged
    ```

12. **Eliminar el Pod usando el mismo manifiesto**

    **Comando**
    ```bash
    kubectl delete -f manifests/primer-pod.yaml
    ```

    **Qué hace**
    Elimina del clúster el recurso definido en el archivo YAML.

    **Por qué**
    Igual que lo creamos declarativamente desde un manifiesto, también podemos eliminarlo desde el mismo manifiesto.

    **Salida esperada**
    ```text
    pod "primer-nginx" deleted
    ```

13. **Confirmar que el recurso ya no existe**

    **Comando**
    ```bash
    kubectl get pod primer-nginx
    ```

    **Qué hace**
    Intenta consultar de nuevo el Pod.

    **Por qué**
    Sirve para validar que la eliminación se ha completado.

    **Salida esperada**
    ```text
    Error from server (NotFound): pods "primer-nginx" not found
    ```

## Idea clave
En este ejercicio has descrito un recurso en YAML y lo has gestionado con `kubectl apply` y `kubectl delete`. Ese es el flujo declarativo básico de Kubernetes: escribir el estado deseado y dejar que el clúster lo aplique.
