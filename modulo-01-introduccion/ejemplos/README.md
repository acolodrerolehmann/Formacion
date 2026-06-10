Ejemplos y pasos para practicar scheduling y tolerations

Pasos rápidos:

1. Etiquetar un nodo (ejemplo):
   kubectl label nodes <NODE> disk=ssd

2. Aplicar un taint (ejemplo):
   kubectl taint nodes <NODE> dedicated=db:NoSchedule

3. Probar manifests:
   kubectl apply -f node-selector.yaml
   kubectl apply -f node-affinity-required.yaml
   kubectl apply -f node-affinity-preferred.yaml
   kubectl apply -f taint-toleration.yaml
   kubectl apply -f daemonset-tolerations.yaml

4. Diagnóstico:
   kubectl get pods -o wide
   kubectl describe pod <POD>

Notas:
- Algunos pasos requieren acceso para taint/label en el cluster. Para los ejercicios en clase el instructor debe tener permisos.
