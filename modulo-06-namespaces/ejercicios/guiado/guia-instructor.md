# Guía del instructor

## Ejercicio: Organizando Recursos con Namespaces

**Objetivo**
- Listar namespaces existentes.
- Revisar `kube-system`.
- Crear `dev` y `prod`.
- Desplegar la misma app en ambos namespaces.
- Aplicar una `ResourceQuota` en `dev`.
- Demostrar el límite de la cuota.
- Probar DNS entre namespaces.
- Limpiar el entorno.

**Preparación**
```bash
cd /Users/andres/Formacion/modulo-06-namespaces/ejercicios/guiado
kubectl config current-context
kubectl get nodes
```

## Secuencia rápida

### 1. Namespaces existentes
```bash
kubectl get ns
kubectl get pods -n kube-system
kubectl get svc -n kube-system
```
**Explicar**
- `default`: namespace por defecto.
- `kube-system`: componentes internos del clúster.
- Un namespace aísla nombres y políticas.

### 2. Crear entornos `dev` y `prod`
```bash
kubectl apply -f manifests/namespaces.yaml
kubectl get ns
```
**Explicar**
- Un mismo clúster puede tener varios entornos.
- `dev` y `prod` permiten separar recursos con el mismo nombre.

### 3. Desplegar la misma app en ambos namespaces
```bash
kubectl apply -f manifests/app-dev.yaml
kubectl apply -f manifests/app-prod.yaml
kubectl wait --for=condition=available deployment/demo-app -n dev --timeout=120s
kubectl wait --for=condition=available deployment/demo-app -n prod --timeout=120s
kubectl get all -n dev
kubectl get all -n prod
```
**Explicar**
- Mismo `Deployment` y mismo `Service` en namespaces distintos.
- El nombre `demo-app` puede repetirse porque el namespace cambia el ámbito.

### 4. Aplicar quota en `dev`
```bash
kubectl apply -f manifests/resourcequota-dev.yaml
kubectl describe quota dev-cuota-basica -n dev
```
**Explicar**
- La cuota limita pods y consumo total de CPU/memoria.
- En este ejemplo `dev` queda restringido y `prod` no.

### 5. Probar el límite
```bash
kubectl apply -f manifests/quota-exceed-dev.yaml
```
**Resultado esperado**
- Error `Forbidden` por superar la cuota de `dev`.

**Explicar**
- La cuota se valida en admisión.
- La idea no es que arranque, sino ver que Kubernetes bloquea el exceso.

### 6. DNS entre namespaces
```bash
kubectl apply -f manifests/dns-client-prod.yaml
kubectl wait --for=condition=Ready pod/dns-client -n prod --timeout=120s
kubectl exec -n prod dns-client -- nslookup demo-app.dev.svc.cluster.local
kubectl exec -n prod dns-client -- wget -qO- http://demo-app:5678
kubectl exec -n prod dns-client -- wget -qO- http://demo-app.dev.svc.cluster.local:5678
```
**Resultado esperado**
- `demo-app` responde desde `prod`.
- `demo-app.dev.svc.cluster.local` responde desde `dev`.

**Explicar**
- Resolución corta: busca primero en el namespace actual.
- FQDN: `servicio.namespace.svc.cluster.local`.

### 7. Limpieza
```bash
kubectl delete ns dev prod
kubectl get ns
```
**Nota**
- Si quedan en `Terminating`, esperar unos segundos y repetir `kubectl get ns`.
