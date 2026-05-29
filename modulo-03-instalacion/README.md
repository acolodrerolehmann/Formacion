# Módulo 3: Instalación de Kubernetes

## Objetivos

- Comprender las opciones de instalación de Kubernetes según el entorno
- Instalar y configurar un clúster Kubernetes local/on-premise
- Diferenciar entre herramientas de instalación: kubeadm, minikube y kind
- Validar la instalación y verificar el estado del clúster
- Preparar el entorno para el producto Border & Travel

## Conceptos clave

### Opciones de instalación

Kubernetes ofrece múltiples formas de instalación según necesidades:

**Kubeadm**: Herramienta oficial para producción en entornos on-premise. Proporciona máximo control y es ideal para clústeres multi-nodo. Requiere gestión manual de certificados y actualización de componentes. Es la opción recomendada para Border & Travel en infraestructura local.

**Minikube**: Solución completa para desarrollo local en una sola máquina. Crea un clúster de un nodo con todas las características de Kubernetes. Excelente para aprendizaje y testing en laptop. Soporta múltiples drivers (Docker, VirtualBox, Hyper-V).

**Kind** (Kubernetes in Docker): Herramienta que ejecuta clústeres Kubernetes dentro de contenedores Docker. Más ligera que minikube, ideal para CI/CD y testing. Permite crear clústeres multi-nodo en desarrollo.

### Comparativa de herramientas

| Característica | Kubeadm | Minikube | Kind |
|---|---|---|---|
| Entorno | On-premise/Producción | Desarrollo local | Desarrollo/CI-CD |
| Complejidad | Alta | Baja | Media |
| Multi-nodo | Sí (nativo) | Sí (limitado) | Sí (en contenedores) |
| Recursos | Altos | Medios | Bajos |
| Curva aprendizaje | Pronunciada | Suave | Media |

### Componentes básicos a validar

Después de la instalación, verifica:

1. **Control Plane**: API Server, Scheduler, Controller Manager, etcd
2. **Worker Nodes**: Kubelet, Container Runtime, kube-proxy
3. **Add-ons**: CNI (network plugin), DNS, monitoring
4. **Recursos**: Pods, Services, ConfigMaps, PersistentVolumes

## Herramientas y configuración

### Instalación con Kubeadm (On-Premise)

Requisitos previos:
- Máquinas Linux (recomendado Ubuntu 20.04+)
- Mínimo 2 GB RAM por nodo
- Container runtime (Docker, containerd o CRI-O)
- Red sin restricciones entre nodos

### Instalación con Minikube (Desarrollo)

Ideal para empezar: proporciona clúster funcional en minutos sin complicaciones de networking.

### Instalación con Kind (Testing)

Perfecta para integración continua y pruebas rápidas de configuraciones.

## Comandos útiles

```bash
# Verificar estado del clúster
kubectl cluster-info
kubectl get nodes
kubectl get pods --all-namespaces

# Componentes del control plane
kubectl get pods -n kube-system
kubectl get services -n kube-system

# Verificar readiness de nodos
kubectl describe node <nombre-nodo>

# Diagnosticar problemas
kubectl logs -n kube-system <pod-name>
kubectl get events -n kube-system

# Ver información del clúster
kubectl version --short
kubectl api-resources
```

## Validación de instalación

Pasos para verificar que el clúster funciona correctamente:

1. Confirmar que todos los nodos están en estado `Ready`
2. Verificar que los pods del control plane están corriendo
3. Crear un deployment de prueba
4. Exponer un servicio y probar conectividad
5. Verificar persistencia con PersistentVolumes (si aplica)

## Referencias

- [Documentación oficial de Kubernetes - Instalación](https://kubernetes.io/es/docs/setup/)
- [Kubeadm - Documentación oficial](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- [Minikube - Repositorio oficial](https://minikube.sigs.k8s.io/)
- [Kind - Documentación](https://kind.sigs.k8s.io/)
- [Arquitectura de Kubernetes](https://kubernetes.io/es/docs/concepts/overview/components/)
- [Validación de clúster](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/)
