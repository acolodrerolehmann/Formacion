# Guía del alumno

## Ejercicio: Organizando Recursos con Namespaces

En este ejercicio vas a crear dos entornos lógicos dentro del mismo clúster: `dev` y `prod`. También comprobarás cómo una `ResourceQuota` limita recursos en un namespace y cómo funciona el DNS entre namespaces.

## Requisitos
- Tener acceso a un clúster Kubernetes.
- Tener `kubectl` configurado.
- Trabajar desde esta carpeta:

```bash
cd /Users/andres/Formacion/modulo-06-namespaces/ejercicios/guiado
```

---

## 1. Ver namespaces existentes

Lista los namespaces disponibles en el clúster:

```bash
kubectl get namespaces
```

Revisa los recursos del namespace `kube-system`:

```bash
kubectl get pods -n kube-system
kubectl get svc -n kube-system
```

**Qué estás haciendo**
- Identificas los namespaces creados por Kubernetes.
- Observas que `kube-system` contiene componentes internos del clúster.

**Resultado esperado**
- Debes ver al menos `default`, `kube-system`, `kube-public` y `kube-node-lease`.
- En `kube-system` verás pods y servicios del plano de control o addons.

---

## 2. Crear los namespaces `dev` y `prod`

Aplica el manifiesto de namespaces:

```bash
kubectl apply -f manifests/namespaces.yaml
```

Verifica el resultado:

```bash
kubectl get ns
```

**Qué estás haciendo**
- Creas dos entornos separados dentro del mismo clúster.
- Esto permite reutilizar nombres de recursos sin conflicto.

**Resultado esperado**
- Deben aparecer los namespaces `dev` y `prod` en estado `Active`.

---

## 3. Desplegar la misma app en `dev`

Aplica el manifiesto:

```bash
kubectl apply -f manifests/app-dev.yaml
```

Espera a que el despliegue esté disponible:

```bash
kubectl wait --for=condition=available deployment/demo-app -n dev --timeout=120s
```

Revisa los recursos creados:

```bash
kubectl get all -n dev
```

**Qué estás haciendo**
- Creas un `Deployment` y un `Service` llamados `demo-app` dentro de `dev`.

**Resultado esperado**
- Debes ver 1 pod, 1 deployment, 1 replicaset y 1 service en `dev`.

---

## 4. Desplegar la misma app en `prod`

Aplica el manifiesto:

```bash
kubectl apply -f manifests/app-prod.yaml
```

Espera a que el despliegue esté disponible:

```bash
kubectl wait --for=condition=available deployment/demo-app -n prod --timeout=120s
```

Revisa los recursos creados:

```bash
kubectl get all -n prod
```

**Qué estás haciendo**
- Despliegas la misma app, con el mismo nombre, en otro namespace.

**Resultado esperado**
- Debes ver otro `demo-app`, esta vez dentro de `prod`.
- No hay conflicto con el `demo-app` de `dev`.

---

## 5. Ver el aislamiento entre namespaces

Comprueba ambos servicios:

```bash
kubectl get svc -n dev
kubectl get svc -n prod
```

**Qué estás haciendo**
- Confirmas que el nombre del servicio puede repetirse porque el namespace forma parte de su identidad.

**Resultado esperado**
- Debes ver un servicio `demo-app` en `dev` y otro en `prod`.

---

## 6. Aplicar una `ResourceQuota` en `dev`

Aplica la cuota:

```bash
kubectl apply -f manifests/resourcequota-dev.yaml
```

Consulta el detalle:

```bash
kubectl describe quota dev-cuota-basica -n dev
```

**Qué estás haciendo**
- Limitas el número de pods y el total de CPU/memoria que pueden solicitarse en `dev`.

**Resultado esperado**
- Debes ver la cuota creada.
- En `Used` aparecerán recursos consumidos por el pod de `demo-app` en `dev`.

---

## 7. Intentar superar la cuota

Aplica este manifiesto de prueba:

```bash
kubectl apply -f manifests/quota-exceed-dev.yaml
```

**Qué estás haciendo**
- Intentas crear un pod con recursos que superan la cuota disponible en `dev`.

**Resultado esperado**
- La creación debe fallar con un error similar a `Forbidden`.
- El mensaje debe indicar que se supera `requests.cpu`, `requests.memory` o el límite definido por la quota.

**Importante**
- Este fallo es intencional.
- El archivo `quota-exceed-dev.yaml` existe para demostrar que la cuota sí funciona.

---

## 8. Crear un cliente DNS en `prod`

Aplica el pod cliente:

```bash
kubectl apply -f manifests/dns-client-prod.yaml
kubectl wait --for=condition=Ready pod/dns-client -n prod --timeout=120s
```

**Qué estás haciendo**
- Creas un pod de utilidad en `prod` para ejecutar pruebas de red y DNS.

**Resultado esperado**
- El pod `dns-client` debe quedar en estado `Running`.

---

## 9. Resolver el servicio de `dev` desde `prod`

Primero, resuelve el nombre completo del servicio en `dev`:

```bash
kubectl exec -n prod dns-client -- nslookup demo-app.dev.svc.cluster.local
```

Luego prueba el acceso al servicio local de `prod` usando nombre corto:

```bash
kubectl exec -n prod dns-client -- wget -qO- http://demo-app:5678
```

Ahora accede al servicio de `dev` usando FQDN:

```bash
kubectl exec -n prod dns-client -- wget -qO- http://demo-app.dev.svc.cluster.local:5678
```

**Qué estás haciendo**
- Verificas la resolución DNS entre namespaces.
- Comparas nombre corto contra nombre completo.

**Resultado esperado**
- `http://demo-app:5678` debe responder con `Hola desde prod`.
- `http://demo-app.dev.svc.cluster.local:5678` debe responder con `Hola desde dev`.

**Idea clave**
- Dentro de un pod, el nombre corto busca primero en el namespace actual.
- Para otro namespace, usa `servicio.namespace.svc.cluster.local`.

---

## 10. Limpiar el entorno

Elimina los namespaces creados para el ejercicio:

```bash
kubectl delete ns dev prod
```

Verifica la limpieza:

```bash
kubectl get ns
```

**Resultado esperado**
- `dev` y `prod` deben desaparecer de la lista.
- Si quedan en `Terminating`, espera unos segundos y vuelve a comprobar.

---

## Resumen

En este ejercicio has visto que:
- Los namespaces separan recursos dentro del mismo clúster.
- Puedes tener la misma app con el mismo nombre en `dev` y `prod`.
- Una `ResourceQuota` limita el consumo de recursos por namespace.
- El DNS entre namespaces usa el formato `servicio.namespace.svc.cluster.local`.
