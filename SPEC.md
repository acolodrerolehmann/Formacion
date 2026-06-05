# Especificaciones del Proyecto: Curso de Formación en Kubernetes

## Resumen

Repositorio de formación en Kubernetes (20 horas teórico-prácticas) diseñado para ser clonado por los alumnos. Contiene documentación breve por módulo y dos tipos de ejercicios:
- **Ejercicios guiados** (1 por módulo): el instructor los realiza en la videoconferencia y los alumnos siguen los pasos. Incluyen guía para instructor (breve) y guía para alumno (detallada).
- **Ejercicios para resolver** (2 por módulo): los alumnos los realizan de forma autónoma. Basados en manifiestos YAML con marcadores TODO/FIX.

Total: 7 guiados + 14 para resolver = **21 ejercicios**.

---

## Estructura del Proyecto

.
├── SPEC.md
├── README.md                              # Presentación del curso y guía de inicio rápido
├── modulo-01-introduccion/
│   ├── README.md                          # Teoría breve del módulo (~500 palabras)
│   └── ejercicios/
│       ├── guiado/
│       │   ├── guia-instructor.md         # Pasos resumidos para el instructor
│       │   ├── guia-alumno.md             # Pasos detallados con explicaciones
│       │   └── manifests/                 # YAMLs completos del ejercicio guiado
│       ├── ejercicio-01/
│       │   ├── enunciado.md               # Descripción + criterio de éxito
│       │   ├── manifests/                 # YAMLs con TODO/FIX
│       │   └── soluciones/                # YAMLs resueltos (rama soluciones)
│       └── ejercicio-02/
│           ├── enunciado.md
│           ├── manifests/
│           └── soluciones/
├── modulo-02-componentes-arquitectura/
│   └── ... (misma estructura)
├── modulo-03-instalacion/
├── modulo-04-gestion-apps-redes/
├── modulo-05-migracion-swarm/
├── modulo-06-namespaces/
└── modulo-07-pods-volumenes-despliegues/

---

## Módulos

| # | Módulo | Contenido principal |
|---|--------|-------------------|
| 1 | Introducción a Kubernetes | Conceptos fundamentales, qué es la orquestación de contenedores |
| 2 | Componentes y arquitectura | Pods, labels/selectors, ReplicaSets, nodos, servicios, APIs |
| 3 | Instalación de Kubernetes | Configuración on-premise/local, kubeadm, minikube, kind |
| 4 | Gestión de aplicaciones, redes y extensibilidad | Helm, operadores, Network Policies, Ingress, rolling updates, CRDs |
| 5 | Migración de Docker Swarm a Kubernetes | Diferencias, similaridades, puntos críticos |
| 6 | Namespaces | Aislamiento, múltiples entornos, políticas de acceso |
| 7 | Pods, volúmenes y despliegues | Pods, PV/PVC, Deployments, StatefulSets, DaemonSets |

---

## Formato de Documentación por Módulo

Cada `README.md` de módulo debe contener:

1. **Título y objetivos** — Qué aprenderá el alumno en este módulo.
2. **Conceptos clave** — Explicación breve y concisa (máximo 2-3 páginas).
3. **Diagramas** (si aplica) — Usar Mermaid o imágenes en `assets/`.
4. **Comandos útiles** — Tabla o lista de comandos `kubectl` relevantes.
5. **Referencias** — Enlaces a documentación oficial de Kubernetes.

---

## Formato de Ejercicios

### Ejercicios Guiados (1 por módulo)

Realizados por el instructor en la videoconferencia. Los alumnos siguen los pasos.

1. **Guía del instructor** (`guia-instructor.md`):
   - Pasos resumidos, solo comandos y manifiestos en orden.
   - Notas sobre qué explicar en cada paso.
   - Estilo cheat-sheet para seguir durante la clase.

2. **Guía del alumno** (`guia-alumno.md`):
   - Pasos numerados con comandos exactos.
   - Explicación breve de cada paso (qué hace y por qué).
   - Resultado esperado en cada paso.
   - Referencia para repasar después de la clase.

3. **Manifiestos** (`manifests/`):
   - YAMLs completos y funcionales (no hay que completar nada).
   - El alumno los aplica tal cual siguiendo la guía.

### Ejercicios para Resolver (2 por módulo)

Realizados de forma autónoma por el alumno.

1. **Enunciado** (`enunciado.md`):
   - Descripción del escenario.
   - Objetivo a conseguir.
   - Pistas (opcionales).
   - Criterio de éxito (cómo verificar que está correcto).

2. **Manifiestos** (`manifests/`):
   - Archivos YAML incompletos o con errores intencionales.
   - Comentarios con `# TODO:` indicando qué debe completar el alumno.
   - Comentarios con `# FIX:` indicando que hay un error a corregir.

3. **Soluciones** (`soluciones/`):
   - Manifiestos YAML correctos y funcionales.
   - Se mantienen en la **rama `soluciones`** para que no estén visibles directamente al clonar.

---

## Convenciones

### Nombres de archivos
- Directorios de módulo: `modulo-XX-nombre-corto/`
- Ejercicios: `XX-ejercicio.md`
- Manifiestos: nombre descriptivo en kebab-case (ej: `nginx-deployment.yaml`)

### Manifiestos YAML
- Usar `apiVersion`, `kind`, `metadata`, `spec` en ese orden.
- Incluir `namespace` explícito cuando sea relevante.
- Usar labels consistentes: `app`, `module`, `exercise`.

### Marcadores en ejercicios
# TODO: Añadir el selector correcto para los pods
selector:
  matchLabels:
    # <completar aquí>

# FIX: El puerto del servicio es incorrecto
ports:
  - port: 8080       # ← corregir este valor
    targetPort: 80

---

## Flujo de Trabajo del Alumno

1. Clonar el repositorio.
2. Navegar al módulo correspondiente.
3. Leer el `README.md` del módulo (teoría breve).
4. Abrir el enunciado del ejercicio.
5. Editar los manifiestos en `manifests/` para completar/corregir.
6. Aplicar con `kubectl apply -f <archivo>.yaml`.
7. Verificar el resultado según el criterio de éxito indicado.
8. Comparar con la solución si es necesario (cambiar a rama `soluciones`).

---

## Ramas del Repositorio

| Rama | Propósito |
|------|-----------|
| `main` | Contenido del curso con ejercicios sin resolver |
| `soluciones` | Misma estructura pero con todos los ejercicios resueltos |

---

## Estilo de Documentación

- **Idioma**: Español.
- **Tono**: Directo y conciso. Evitar textos largos.
- **Formato**: Markdown estándar compatible con GitHub.
- **Extensión máxima por módulo**: ~500 palabras de teoría. Los conceptos extensos se enlazan a la documentación oficial.

---

## Entregables

- [ ] README.md raíz con presentación del curso
- [ ] 7 módulos con documentación breve (~500 palabras cada uno)
- [ ] 7 ejercicios guiados (guía instructor + guía alumno + manifests)
- [ ] 14 ejercicios para resolver (enunciado + manifiestos TODO/FIX + soluciones)
- [ ] Soluciones completas en rama `soluciones`
- [ ] Estructura de directorios consistente
