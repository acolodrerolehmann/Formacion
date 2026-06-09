# Ejercicio 02 — Service (NodePort)

Objetivo

Crear un Deployment llamado `hello-nodeport` (2 réplicas) que sirva una página HTTP simple (nginx) y exponerlo mediante un Service de tipo `NodePort` llamado `hello-nodeport`.

Criterios de éxito

- El Deployment tiene 2 réplicas en estado `Ready`.
- El Service `hello-nodeport` existe y tiene tipo `NodePort`.
- Se puede acceder al servicio desde el exterior del clúster usando el puerto NodePort (o mediante port-forward).

Archivos a preparar

- manifests/template/deployment.yaml
- manifests/template/service.yaml
- manifests/solution/deployment.yaml
- manifests/solution/service.yaml

Comandos de verificación

kubectl apply -f manifests/solution/
kubectl get svc hello-nodeport
# Para probar desde el host (si NodePort 30080):
curl http://<NODE_IP>:30080
# Alternativa: port-forward
kubectl port-forward svc/hello-nodeport 8080:80
curl http://localhost:8080

Notas

- En Kind puede que el NodePort no esté disponible directamente en localhost; usa port-forward o configura MetalLB.
