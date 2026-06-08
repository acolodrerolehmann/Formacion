# Multi-stage Dockerfile for material-curso
# Two targets: `frontend` (nginx serving Vite build) and `backend` (FastAPI + Uvicorn).
# Build commands:
#  docker build -f Dockerfile --target frontend -t material-curso-frontend:latest .
#  docker build -f Dockerfile --target backend -t material-curso-backend:latest .

# --------------------
# Frontend builder
# --------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app
# copy package files first to leverage layer cache
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --silent
COPY frontend/ .
RUN npm run build

# Frontend runtime (nginx)
FROM nginx:alpine AS frontend
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# --------------------
# Backend: install deps in a builder stage
# --------------------
FROM python:3.11-slim AS backend-builder
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Copy requirements and install into /usr/local so we can copy the installed libs to final
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefix=/usr/local -r requirements.txt
# Copy backend source
COPY backend/ .

# Backend runtime image
FROM python:3.11-slim AS backend
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Copy installed Python packages from builder
COPY --from=backend-builder /usr/local /usr/local
# Copy app code
COPY --from=backend-builder /app /app
ENV PATH="/usr/local/bin:${PATH}"
EXPOSE 5000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
