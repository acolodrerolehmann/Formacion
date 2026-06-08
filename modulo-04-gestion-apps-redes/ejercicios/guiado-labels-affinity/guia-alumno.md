# Ejercicio Guiado: Labels, Annotations y NodeAffinity

## Objetivos

- Entender la diferencia entre Labels y Annotations
- Usar Labels para organizar y filtrar recursos
- Aplicar nodeSelector y nodeAffinity para controlar el scheduling de pods
- Observar qué pasa cuando un pod no puede ser programado (Pending)

## Requisitos Previos

- Clúster Kind con al menos 2 worker nodes
- `kubectl` configurado

---

## Parte 1: Crear el clúster multi-nodo

Para este ejercicio necesitamos un clúster con múltiples nodos. Crea el clúster:

```bash
kind create cluster --name labels-lab --config manifests/kind-multinode.yaml
```

Verifica los nodos:

```bash
kubectl get nodes
# Deberías ver: 1 control-plane + 2 workers
```

---

## Parte 2: Labels y Annotations en Pods

### Paso 1: Desplegar pods con labels

```bash
kubectl apply -f manifests/01-pods-labels.yaml
```

### Paso 2: Consultar pods por labels

```bash
# Ver todos los pods con sus labels
kubectl get pods --show-labels

# Filtrar por label app
kubectl get pods -l app=web

# Filtrar por entorno
kubectl get pods -l env=production

# Filtrar con operadores
kubectl get pods -l 'env in (production, staging)'

# Filtrar por múltiples labels (AND)
kubectl get pods -l app=web,env=production
```

### Paso 3: Añadir y modificar labels en caliente

```bash
# Añadir label
kubectl label pod web-prod version=v2.0

# Verificar
kubectl get pod web-prod --show-labels

# Sobrescribir label existente
kubectl label pod web-prod version=v2.1 --overwrite

# Eliminar label
kubectl label pod web-prod version-
```

### Paso 4: Ver annotations

```bash
kubectl get pod web-prod -o jsonpath='{.metadata.annotations}' | python3 -m json.tool
```

> **Observa:** Las annotations contienen metadatos descriptivos pero NO se pueden usar con `-l` (selector).

---

## Parte 3: Labels en Nodos y nodeSelector

### Paso 1: Ver labels actuales de los nodos

```bash
kubectl get nodes --show-labels
```

### Paso 2: Asignar labels personalizadas a los nodos

```bash
# Asignar tipo de disco a cada worker
kubectl label nodes labels-lab-worker disk=ssd
kubectl label nodes labels-lab-worker2 disk=hdd

# Verificar
kubectl get nodes -l disk=ssd
kubectl get nodes -l disk=hdd
```

### Paso 3: Desplegar pod con nodeSelector

```bash
kubectl apply -f manifests/02-pod-nodeselector.yaml
```

Verifica en qué nodo se ejecuta:

```bash
kubectl get pod nginx-ssd -o wide
# Debe estar en el nodo con label disk=ssd (labels-lab-worker)
```

### Paso 4: Probar un nodeSelector imposible

```bash
kubectl apply -f manifests/03-pod-nodeselector-imposible.yaml
```

```bash
# El pod quedará en Pending porque no hay nodo con disk=nvme
kubectl get pod nginx-nvme
kubectl describe pod nginx-nvme | grep -A5 Events
```

> **Conclusión:** Si `nodeSelector` no encuentra nodo compatible, el pod queda **Pending** indefinidamente.

Limpia:

```bash
kubectl delete pod nginx-nvme
```

---

## Parte 4: NodeAffinity

### Paso 1: Affinity obligatoria (required)

```bash
kubectl apply -f manifests/04-pod-affinity-required.yaml
```

```bash
kubectl get pod app-ssd-required -o wide
# Debe estar en el nodo con disk=ssd
```

### Paso 2: Affinity preferente (preferred)

```bash
kubectl apply -f manifests/05-pod-affinity-preferred.yaml
```

```bash
kubectl get pod app-ssd-preferred -o wide
# Preferirá el nodo con disk=ssd, pero si no hay espacio puede ir a otro
```

### Paso 3: Combinar required + preferred

```bash
kubectl apply -f manifests/06-pod-affinity-combinada.yaml
```

```bash
kubectl get pod app-combo -o wide
kubectl describe pod app-combo | grep -A10 "Node-Selectors\|Tolerations\|Events"
```

> **Observa:** El pod DEBE estar en un nodo con `disk=ssd` (required). Además, PREFIERE estar en un nodo con `zone=eu-west-1a` (preferred), pero no es obligatorio.

---

## Parte 5: Efecto visual — Mover pods entre nodos

### Paso 1: Etiquetar nodos con zonas

```bash
kubectl label nodes labels-lab-worker zone=eu-west-1a
kubectl label nodes labels-lab-worker2 zone=eu-west-1b
```

### Paso 2: Desplegar un Deployment con affinity

> Nota: este ejercicio introduce Deployments — el controlador que gestiona réplicas de pods y actualizaciones declarativas. Por detrás, un Deployment crea y mantiene un ReplicaSet. La explicación detallada de ReplicaSet y estrategias de despliegue se encuentra en [Módulo 7 - Pods, Volúmenes y Despliegues](../../../modulo-07-pods-volumenes-despliegues/README.md).

```bash
kubectl apply -f manifests/07-deployment-affinity.yaml
```

```bash
# Ver distribución de pods en nodos
kubectl get pods -l app=zoned-app -o wide
```

### Paso 3: Cambiar la label del nodo y observar

```bash
# Cambiar la zona del worker2
kubectl label nodes labels-lab-worker2 zone=eu-west-1a --overwrite

# Los pods existentes NO se mueven (IgnoredDuringExecution)
kubectl get pods -l app=zoned-app -o wide

# Pero si recreamos pods, irán al nodo preferido
kubectl delete pods -l app=zoned-app
kubectl get pods -l app=zoned-app -o wide
```

> **Lección clave:** NodeAffinity solo afecta al scheduling inicial. Los pods ya corriendo NO se mueven si las labels cambian.

---

## Limpieza

```bash
kind delete cluster --name labels-lab
```

---

## Resumen

| Concepto | Uso | ¿Seleccionable? |
|----------|-----|-----------------|
| **Labels** | Organizar, filtrar, seleccionar recursos | ✅ Sí |
| **Annotations** | Metadatos descriptivos, config de herramientas | ❌ No |
| **nodeSelector** | Scheduling simple (label exacta) | — |
| **nodeAffinity required** | Scheduling obligatorio (operadores) | — |
| **nodeAffinity preferred** | Scheduling preferente (soft constraint) | — |
