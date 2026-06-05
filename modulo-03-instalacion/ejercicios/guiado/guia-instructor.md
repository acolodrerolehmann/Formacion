# Guía del instructor

## Objetivo
Levantar un clúster local con kind, validarlo y eliminarlo.

## Duración estimada
20-25 minutos.

## Requisitos
- Docker en ejecución
- `kubectl` instalado
- `kind` instalado o acceso para instalarlo
- Internet para descargar imágenes

## Flujo rápido
1. Verificar herramientas:
   docker info >/dev/null && echo "Docker OK"
   kubectl version --client
   kind --version
2. Si `kind` no existe:
   - macOS: `brew install kind`
   - Linux:
     curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64
     chmod +x ./kind
     sudo mv ./kind /usr/local/bin/kind
3. Crear clúster:
   kind create cluster --name m3-kind --config manifests/kind-cluster.yaml
4. Verificar:
   kubectl cluster-info --context kind-m3-kind
   kubectl get nodes -o wide
5. Desplegar app:
   kubectl apply -f manifests/test-app.yaml
   kubectl -n demo rollout status deployment/web
   kubectl -n demo get all
   curl -I http://localhost:8080
6. Explorar componentes:
   kubectl get pods -n kube-system -o wide
7. Limpiar:
   kubectl delete -f manifests/test-app.yaml
   kind delete cluster --name m3-kind

## Resultados esperados
- 3 nodos en estado `Ready`
- Pods de `kube-system` en `Running`
- Deployment `web` con `2/2` réplicas disponibles
- Respuesta HTTP 200 en `http://localhost:8080`

## Puntos a remarcar
- kind ejecuta Kubernetes dentro de contenedores Docker.
- El clúster usa 1 `control-plane` y 2 `worker`.
- El puerto local `8080` se redirige al `NodePort 30080`.
- `kubectl` cambia al contexto `kind-m3-kind` al crear el clúster.

## Problemas comunes
- Docker apagado: iniciar Docker Desktop o el daemon.
- `kind: command not found`: instalar y reabrir terminal.
- Nodos en `NotReady`: esperar 1-2 minutos y repetir `kubectl get nodes`.
- `curl localhost:8080` falla: comprobar que el clúster sigue activo y que el puerto 8080 no está ocupado.
- Contexto incorrecto: `kubectl config use-context kind-m3-kind`.
