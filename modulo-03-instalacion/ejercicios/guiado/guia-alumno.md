# Ejercicio guiado: Instalación de un clúster local con kind

## Objetivo
Crear un clúster local de Kubernetes con kind, validarlo con `kubectl`, desplegar una aplicación de prueba y eliminar el entorno.

## Requisitos
- Docker en ejecución
- `kubectl` instalado
- Acceso a Internet
- Terminal con permisos para instalar binarios si hace falta

## Archivos del ejercicio
- `manifests/kind-cluster.yaml`: definición del clúster
- `manifests/test-app.yaml`: aplicación de prueba

## Paso 1. Verificar herramientas base
Comprueba que Docker y `kubectl` están disponibles.

docker info >/dev/null && echo "Docker OK"
kubectl version --client
kind --version

Si `kind --version` responde, sigue al paso 3.

## Paso 2. Instalar kind si no está disponible
### Opción A. macOS con Homebrew
brew install kind

### Opción B. Linux
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

Verifica la instalación:

kind --version

## Paso 3. Revisar la configuración del clúster
Abre el archivo y localiza estos puntos:
- 1 nodo `control-plane`
- 2 nodos `worker`
- Mapeo del puerto local `8080` al `NodePort 30080`

cat manifests/kind-cluster.yaml

## Paso 4. Crear el clúster
Ejecuta el siguiente comando desde esta carpeta:

kind create cluster --name m3-kind --config manifests/kind-cluster.yaml

Qué debe ocurrir:
- kind crea tres contenedores Docker
- `kubectl` queda apuntando al contexto `kind-m3-kind`
- el clúster tarda entre 1 y 2 minutos en estar listo

## Paso 5. Verificar que el clúster está operativo
Consulta la información básica del clúster:

kubectl cluster-info --context kind-m3-kind
kubectl get nodes -o wide

Resultado esperado:
- se muestra la URL del API Server
- aparecen 3 nodos
- los 3 nodos están en estado `Ready`

## Paso 6. Desplegar una aplicación de prueba
Aplica el manifiesto del ejercicio:

kubectl apply -f manifests/test-app.yaml

Comprueba el despliegue:

kubectl -n demo rollout status deployment/web
kubectl -n demo get all

Resultado esperado:
- namespace `demo` creado
- deployment `web` disponible
- servicio `web` expuesto como `NodePort`

## Paso 7. Probar acceso a la aplicación
El clúster expone el servicio en el puerto local `8080`.

curl -I http://localhost:8080

Resultado esperado:
- respuesta `HTTP/1.1 200 OK` o `HTTP/2 200`

Si falla, espera unos segundos y repite. También puedes revisar los pods:

kubectl -n demo get pods -o wide

## Paso 8. Explorar los componentes del clúster
Lista los pods del namespace del sistema:

kubectl get pods -n kube-system -o wide

Identifica al menos estos componentes:
- `coredns`
- `etcd`
- `kube-apiserver`
- `kube-controller-manager`
- `kube-scheduler`
- `kube-proxy`
- `kindnet`

Pregunta guía:
- ¿Qué pods se ejecutan solo en el control plane?
- ¿Qué componentes aparecen en todos los nodos?

## Paso 9. Limpiar el entorno
Elimina la aplicación y después el clúster:

kubectl delete -f manifests/test-app.yaml
kind delete cluster --name m3-kind

Verifica que ya no existe:

kind get clusters

Resultado esperado:
- `m3-kind` ya no aparece en la lista

## Resumen
En este ejercicio has hecho lo siguiente:
1. Verificar o instalar `kind`
2. Crear un clúster local con 1 control plane y 2 workers
3. Validar el clúster con `kubectl`
4. Desplegar una aplicación de prueba
5. Revisar componentes de `kube-system`
6. Eliminar el entorno
