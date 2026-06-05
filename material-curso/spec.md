# Aplicación Base del Curso: VoyageR — Agencia de Viajes

## Descripción

Aplicación web 3-tier para gestión de viajes de una agencia ficticia. Se usa como aplicación de referencia durante todo el curso para practicar despliegues en Kubernetes.

## Arquitectura

┌──────────────────────────────┐
│         FRONTEND             │
│   React + TypeScript + Vite  │
│   Tailwind CSS               │
│   Servido con nginx (:80)    │
│   Proxy /api → backend:5000  │
└─────────────┬────────────────┘
              │ HTTP
┌─────────────▼────────────────┐
│          BACKEND             │
│   FastAPI (Python 3.11)      │
│   SQLAlchemy + psycopg2      │
│   Puerto: 5000               │
└─────────────┬────────────────┘
              │ TCP/5432
┌─────────────▼────────────────┐
│         DATABASE             │
│   PostgreSQL 16              │
│   Datos seed incluidos       │
└──────────────────────────────┘

## Stack Tecnológico

| Capa | Tecnología | Imagen Docker |
|------|-----------|---------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS | node:20-alpine (build) + nginx:alpine (runtime) |
| Backend | FastAPI, SQLAlchemy, Pydantic, uvicorn | python:3.11-slim |
| Database | PostgreSQL 16 | postgres:16-alpine |

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/trips` | Listar todos los viajes |
| `GET` | `/api/trips/{id}` | Detalle de un viaje |
| `POST` | `/api/trips` | Crear un viaje nuevo |
| `PUT` | `/api/trips/{id}` | Actualizar un viaje |
| `DELETE` | `/api/trips/{id}` | Eliminar un viaje |
| `GET` | `/api/health` | Health check (status + DB connectivity) |

## Modelo de Datos

### Tabla: `trips`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PK | Identificador único |
| `title` | VARCHAR(200) | Nombre del viaje |
| `description` | TEXT | Descripción detallada |
| `destination` | VARCHAR(100) | Ciudad/país destino |
| `price` | DECIMAL(10,2) | Precio por persona (€) |
| `departure_date` | DATE | Fecha de salida |
| `duration_days` | INTEGER | Duración en días |
| `available_seats` | INTEGER | Plazas disponibles |
| `image_url` | VARCHAR(500) | URL de imagen del destino |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

## Variables de Entorno

### Backend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string completa | `postgresql://user:pass@host:5432/db` |
| `DB_HOST` | Host de PostgreSQL (alternativa) | `postgres` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la BD | `voyager` |
| `DB_PASSWORD` | Contraseña de la BD | `voyager-pass` |
| `DB_NAME` | Nombre de la BD | `voyager` |

> Si `DATABASE_URL` está definida, se usa directamente. Si no, se construye a partir de `DB_*`.

### Frontend (build-time)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL de la API (en build) | `/api` |

### Frontend (runtime — nginx)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `BACKEND_URL` | URL del backend para el proxy nginx | `http://backend:5000` |

### PostgreSQL

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `POSTGRES_USER` | Usuario admin | `voyager` |
| `POSTGRES_PASSWORD` | Contraseña | `voyager-pass` |
| `POSTGRES_DB` | Base de datos | `voyager` |

## Datos Seed

La aplicación incluye ~10 viajes pre-cargados con destinos populares:
- Tokio, Japón
- Santorini, Grecia
- Machu Picchu, Perú
- Safari en Kenia
- Islandia (aurora boreal)
- Nueva York, USA
- Bali, Indonesia
- Patagonia, Argentina
- Marrakech, Marruecos
- Fiordos, Noruega

## Ejecución Local

docker compose up --build

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs (Swagger): http://localhost:5000/docs

## Uso en el Curso

Esta aplicación se utiliza en los siguientes módulos:
- **Módulo 3**: Primera instalación y `kubectl apply`
- **Módulo 4**: ConfigMaps, Secrets, Ingress
- **Módulo 5**: Migración desde Docker Compose a K8s
- **Módulo 7**: Deployments, PVCs, StatefulSets
