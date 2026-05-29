# Módulo 1: Introducción a Kubernetes

## Objetivos

Al completar este módulo, serás capaz de:
- Entender qué es Kubernetes y por qué existe
- Comprender los conceptos fundamentales de orquestación de contenedores
- Identificar cuándo usar Kubernetes vs alternativas más simples
- Familiarizarte con la terminología básica y el ecosistema
- Ejecutar comandos básicos de kubectl

---

## Conceptos Clave

### ¿Qué es Kubernetes?

Kubernetes (K8s) es una plataforma de código abierto para automatizar el despliegue, escalado y operación de aplicaciones en contenedores. Fue originalmente desarrollado por Google y donado a la Cloud Native Computing Foundation (CNCF).

Es un **orquestador de contenedores** que abstrae la infraestructura subyacente y te permite trabajar con un cluster como una única unidad lógica, en lugar de servidores individuales.

### ¿Por qué existe Kubernetes?

Con Docker, los contenedores revolucionaron el empaquetado de aplicaciones. Sin embargo, en entornos de producción con múltiples contenedores surgen desafíos:

- **Coordinar contenedores**: ¿Dónde ejecutar cada uno?
- **Tolerancia a fallos**: ¿Qué hacer si un contenedor cae?
- **Escalado**: ¿Cómo distribuir el tráfico entre instancias?
- **Actualizaciones**: ¿Cómo desplegar sin downtime?
- **Recursos**: ¿Cómo gestionar CPU, memoria y almacenamiento?

Kubernetes automatiza estas tareas complejas.

### Orquestación de Contenedores

La orquestación es el acto de coordinar múltiples contenedores automáticamente. Kubernetes maneja:

- **Scheduling**: Decide en qué nodo ejecutar cada pod
- **Auto-scaling**: Aumenta/disminuye réplicas según demanda
- **Auto-healing**: Reinicia contenedores que fallan
- **Rolling updates**: Despliegues sin parar la aplicación
- **Declarative configuration**: Define el estado deseado, K8s lo mantiene

### Ventajas Clave

| Ventaja | Descripción |
|---------|-------------|
| **Auto-healing** | Reinicia pods fallidos automáticamente |
| **Escalado automático** | Agrega/elimina réplicas según CPU/memoria |
| **Configuración declarativa** | Defines el estado deseado, K8s lo implementa |
| **Multi-nodo** | Distribuye carga entre múltiples servidores |
| **Actualizaciones sin parada** | Rolling updates sin downtime |
| **Portabilidad** | Funciona igual en cualquier cloud o datacenter |

### Comparación con Alternativas

#### Docker Compose
- ✅ Perfecto para desarrollo local
- ❌ No escala más allá de un solo host
- ❌ Sin auto-healing ni auto-scaling
- ❌ No apto para producción con alta disponibilidad

#### Ejecutar contenedores manualmente
- ✅ Control total
- ❌ Manual, propenso a errores
- ❌ Escalado imposible con muchos servidores

#### Kubernetes
- ✅ Producción empresarial
- ✅ Multi-nodo, auto-healing, auto-scaling
- ❌ Curva de aprendizaje más pronunciada
- ❌ Overhead de infraestructura

### ¿Cuándo usar Kubernetes?

**Usa Kubernetes si:**
- Ejecutas múltiples contenedores en producción
- Necesitas alta disponibilidad
- Planeas escalar horizontalmente
- Requieres auto-healing y orchestration
- Trabaja en equipo de DevOps

**No uses Kubernetes si:**
- Solo tienes un puñado de contenedores
- Desarrollo local o pequeño prototipo
- Tu aplicación no es cloud-native
- No tienes experiencia ops

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `kubectl version` | Verifica versión de kubectl y API server |
| `kubectl cluster-info` | Información del cluster conectado |
| `kubectl get nodes` | Lista los nodos del cluster |
| `kubectl get pods` | Lista los pods en el namespace actual |
| `kubectl get pods --all-namespaces` | Lista pods en todos los namespaces |
| `kubectl describe node <nombre>` | Detalles de un nodo |
| `kubectl get services` | Lista los servicios disponibles |

---

## Referencias Oficiales

- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/)
- [Conceptos de Kubernetes](https://kubernetes.io/docs/concepts/)
- [¿Qué es Kubernetes? - Guía oficial](https://kubernetes.io/es/docs/concepts/overview/)
- [CNCF - Cloud Native Computing Foundation](https://www.cncf.io/)

