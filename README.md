# Curso de Formación: Kubernetes

## Descripción

Curso de 20 horas teórico-prácticas sobre Kubernetes. Cubre desde conceptos básicos de orquestación de contenedores hasta temas avanzados como Helm, operadores, políticas de red y CRDs.

## Cómo usar este repositorio

1. **Clona** el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd formacion-kubernetes
   ```

2. **Navega** al módulo correspondiente a la sesión.

3. **Lee** el `README.md` del módulo para repasar la teoría.

4. **Ejercicios guiados**: Sigue la `guia-alumno.md` durante la clase.

5. **Ejercicios para resolver**: Lee el `enunciado.md`, edita los manifiestos en `manifests/` y aplica con:
   ```bash
   kubectl apply -f <archivo>.yaml
   ```

6. **Verifica** tu solución según el criterio de éxito del enunciado.

7. **Consulta** las soluciones si lo necesitas:
   ```bash
   git checkout soluciones -- <ruta-al-ejercicio>/soluciones/
   ```

## Módulos

| # | Módulo | Duración aprox. |
|---|--------|----------------|
| 1 | [Introducción a Kubernetes](modulo-01-introduccion/) | 2h |
| 2 | [Componentes y arquitectura](modulo-02-componentes-arquitectura/) | 3h |
| 3 | [Instalación de Kubernetes](modulo-03-instalacion/) | 3h |
| 4 | [Gestión de aplicaciones, redes y extensibilidad](modulo-04-gestion-apps-redes/) | 4h |
| 5 | [Migración de Docker Swarm a Kubernetes](modulo-05-migracion-swarm/) | 2h |
| 6 | [Namespaces](modulo-06-namespaces/) | 3h |
| 7 | [Pods, volúmenes y despliegues](modulo-07-pods-volumenes-despliegues/) | 3h |

## Estructura de ejercicios

Cada módulo contiene:

- **1 ejercicio guiado** — Se realiza en clase con el instructor. Incluye:
  - `guia-instructor.md`: pasos resumidos
  - `guia-alumno.md`: pasos detallados con explicaciones
  - `manifests/`: YAMLs completos para aplicar

- **2 ejercicios para resolver** — Se realizan de forma autónoma. Incluyen:
  - `enunciado.md`: escenario, objetivo y criterio de éxito
  - `manifests/`: YAMLs con marcadores `# TODO:` y `# FIX:`
  - `soluciones/`: disponibles en la rama `soluciones`
