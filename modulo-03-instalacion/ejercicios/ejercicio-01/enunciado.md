# Ejercicio 1: Crear un Clúster Personalizado con kind

## Escenario
Necesitas un clúster local para validar despliegues antes de pasar a un entorno más completo. Debe simular una topología mínima multi-nodo y exponer puertos del nodo `control-plane` hacia tu máquina.

## Objetivo
Completar el archivo `manifests/kind-config.yaml` y crear un clúster con kind.

## Requisitos
- 1 nodo `control-plane`
- 3 nodos `worker`
- Mapeos de puertos en el `control-plane`:
  - `8080` del host -> `80` del contenedor
  - `8443` del host -> `443` del contenedor
- Mantener `apiVersion: kind.x-k8s.io/v1alpha4`

## Tareas
1. Completa todos los `# TODO:` de `manifests/kind-config.yaml`.
2. Crea el clúster con:
   kind create cluster --name m3-kind --config manifests/kind-config.yaml
3. Verifica que aparecen 4 nodos con `kubectl get nodes`.
4. Confirma que el nodo `control-plane` tiene los puertos publicados.

## Entregables
- `manifests/kind-config.yaml` completo
- Comando usado para crear el clúster
- Salida de `kubectl get nodes`
