# Ejercicio 1: Deployment con Volúmenes Persistentes

## Escenario
Debes desplegar una aplicación web que guarda archivos subidos por usuarios. Si el pod se reinicia, los archivos no pueden perderse.

## Objetivo
Completa los manifiestos para crear un almacenamiento persistente y montarlo en un `Deployment`.

## Archivos a completar
- `manifests/pv.yaml`
- `manifests/pvc.yaml`
- `manifests/deployment.yaml`

## Requisitos
1. El `PersistentVolume` debe llamarse `uploads-pv`.
2. El `PersistentVolumeClaim` debe llamarse `uploads-pvc`.
3. Usa `storageClassName: manual`.
4. Usa `ReadWriteOnce`.
5. Usa `1Gi` de almacenamiento.
6. Usa la ruta del nodo `/data/webapp-uploads`.
7. Monta el volumen en `/usr/share/nginx/html/uploads`.
8. Mantén `persistentVolumeReclaimPolicy: Retain`.

## Validación sugerida
kubectl apply -f manifests/
kubectl get pv,pvc
kubectl get deployments,pods
kubectl describe pod <nombre-del-pod>


# Nota, si no funciona el default the Kind, usar

kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml

# Make it the default
kubectl patch storageclass local-path \
  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'kubectl exec -n kube-system ds/cilium -- hubble observe --namespace default