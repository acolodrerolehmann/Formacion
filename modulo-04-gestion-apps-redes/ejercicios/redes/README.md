# Ejercicios de Redes — Módulo 04

Esta carpeta contiene ejercicios de ejemplo sobre networking en Kubernetes.

Ejercicios incluidos:

- 01-service-clusterip: Deployment + Service (ClusterIP)
- 02-service-nodeport: Deployment + Service (NodePort)

Aplicar las soluciones:

kubectl apply -f modulo-04-gestion-apps-redes/ejercicios/redes/01-service-clusterip/manifests/solution
kubectl apply -f modulo-04-gestion-apps-redes/ejercicios/redes/02-service-nodeport/manifests/solution

Verificación rápida:

kubectl get deployments,svc

Probar desde un pod cliente dentro del clúster:

kubectl run --rm -it --image=curlimages/curl curlpod -- sh -c 'curl -sS http://hello-clusterip'

Para NodePort (ej. 30080) desde el host:

kubectl get svc hello-nodeport
kubectl port-forward svc/hello-nodeport 8080:80
curl http://localhost:8080

Notas:
- En Kind, el NodePort puede no estar directamente expuesto en localhost; usa "kubectl port-forward" o configura MetalLB/LoadBalancer.
- NetworkPolicy y LoadBalancer se cubrirán en ejercicios adicionales.
