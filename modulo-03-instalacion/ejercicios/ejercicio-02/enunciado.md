# Ejercicio 2: Diagnosticar un Clúster con Problemas

## Escenario
Has recibido un clúster recién instalado. El equipo afirma que la instalación terminó, pero el clúster no está listo para usar. Solo dispones de estas salidas:

$ kubectl get nodes
NAME        STATUS     ROLES           AGE   VERSION
cp-01       NotReady   control-plane   8m    v1.30.1
worker-01   NotReady   <none>          6m    v1.30.1
worker-02   NotReady   <none>          6m    v1.30.1

$ kubectl get pods -n kube-system
NAME                              READY   STATUS    RESTARTS   AGE
coredns-76f75df574-2d8rj          0/1     Pending   0          7m
coredns-76f75df574-lf9tq          0/1     Pending   0          7m
etcd-cp-01                        1/1     Running   0          8m
kube-apiserver-cp-01              1/1     Running   0          8m
kube-controller-manager-cp-01     1/1     Running   0          8m
kube-proxy-6g2tr                  1/1     Running   0          6m
kube-proxy-p6m7h                  1/1     Running   0          6m
kube-proxy-zdd2b                  1/1     Running   0          8m
kube-scheduler-cp-01              1/1     Running   0          8m

$ kubectl describe node cp-01
...
Ready   False
Message: container runtime network not ready: NetworkPluginNotReady: cni plugin not initialized

## Qué debes hacer
1. Identifica el problema principal.
2. Completa `manifests/diagnostico.sh` con comandos para:
   - confirmar el estado de nodos y pods críticos
   - obtener evidencia del fallo
   - aplicar una corrección
   - verificar que el clúster queda operativo
3. Usa comentarios cortos y comandos claros.

## Restricciones
- No borres el clúster.
- No cambies la estructura base del script.
- No sustituyas los `# TODO:` por texto explicativo: deben convertirse en comandos.

## Pista
Si los nodos están en `NotReady` y CoreDNS queda en `Pending`, revisa primero la red del clúster.

## Entregable
- `manifests/diagnostico.sh` completo y ejecutable
