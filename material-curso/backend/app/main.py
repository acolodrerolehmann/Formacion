from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .models import Trip
from .schemas import TripCreate, TripUpdate, TripResponse
from .seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield


app = FastAPI(
    title="VoyageR API",
    description="API de gestión de viajes — Aplicación base del curso de Kubernetes",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check — verifica conectividad con la base de datos."""
    try:
        count = db.query(Trip).count()
        return {"status": "healthy", "trips_count": count}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {e}")


@app.get("/api/trips", response_model=List[TripResponse], tags=["Trips"])
def list_trips(db: Session = Depends(get_db)):
    """Listar todos los viajes disponibles."""
    return db.query(Trip).order_by(Trip.departure_date).all()


@app.get("/api/trips/{trip_id}", response_model=TripResponse, tags=["Trips"])
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    """Obtener detalle de un viaje por ID."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")
    return trip


@app.post("/api/trips", response_model=TripResponse, status_code=201, tags=["Trips"])
def create_trip(trip_data: TripCreate, db: Session = Depends(get_db)):
    """Crear un nuevo viaje."""
    trip = Trip(**trip_data.model_dump())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@app.put("/api/trips/{trip_id}", response_model=TripResponse, tags=["Trips"])
def update_trip(trip_id: int, trip_data: TripUpdate, db: Session = Depends(get_db)):
    """Actualizar un viaje existente."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")

    update_data = trip_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(trip, field, value)

    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/trips/{trip_id}", status_code=204, tags=["Trips"])
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Eliminar un viaje."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")
    db.delete(trip)
    db.commit()
