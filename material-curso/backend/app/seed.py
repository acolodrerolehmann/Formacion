from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from .database import SessionLocal, engine, Base
from .models import Trip


SAMPLE_TRIPS = [
    {
        "title": "Explorando Tokio",
        "description": "Sumérgete en la cultura japonesa: templos ancestrales, tecnología futurista y la mejor gastronomía del mundo.",
        "destination": "Tokio, Japón",
        "price": Decimal("2899.99"),
        "departure_date": date(2025, 3, 15),
        "duration_days": 10,
        "available_seats": 16,
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    },
    {
        "title": "Atardecer en Santorini",
        "description": "Casas blancas, cúpulas azules y los atardeceres más espectaculares del Mediterráneo.",
        "destination": "Santorini, Grecia",
        "price": Decimal("1599.00"),
        "departure_date": date(2025, 6, 1),
        "duration_days": 7,
        "available_seats": 20,
        "image_url": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    },
    {
        "title": "Machu Picchu y el Valle Sagrado",
        "description": "Camina por el Inca Trail hasta la ciudadela perdida de los Incas. Una experiencia única.",
        "destination": "Cusco, Perú",
        "price": Decimal("3200.00"),
        "departure_date": date(2025, 5, 10),
        "duration_days": 12,
        "available_seats": 12,
        "image_url": "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
    },
    {
        "title": "Safari en Kenia",
        "description": "Observa los Big Five en su hábitat natural. Masai Mara, Amboseli y Tsavo en un solo viaje.",
        "destination": "Nairobi, Kenia",
        "price": Decimal("4100.00"),
        "departure_date": date(2025, 7, 20),
        "duration_days": 9,
        "available_seats": 8,
        "image_url": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
    },
    {
        "title": "Auroras Boreales en Islandia",
        "description": "Cascadas, géiseres, glaciares y auroras boreales. La isla de hielo y fuego te espera.",
        "destination": "Reikiavik, Islandia",
        "price": Decimal("2750.00"),
        "departure_date": date(2025, 11, 5),
        "duration_days": 8,
        "available_seats": 14,
        "image_url": "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
    },
    {
        "title": "Nueva York: La Ciudad que Nunca Duerme",
        "description": "Broadway, Central Park, Estatua de la Libertad y la mejor pizza del mundo.",
        "destination": "Nueva York, USA",
        "price": Decimal("1899.99"),
        "departure_date": date(2025, 4, 18),
        "duration_days": 6,
        "available_seats": 24,
        "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    },
    {
        "title": "Relax en Bali",
        "description": "Templos, arrozales, playas paradisíacas y spas. El destino perfecto para desconectar.",
        "destination": "Bali, Indonesia",
        "price": Decimal("2100.00"),
        "departure_date": date(2025, 9, 12),
        "duration_days": 11,
        "available_seats": 18,
        "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    },
    {
        "title": "Patagonia Salvaje",
        "description": "Torres del Paine, Perito Moreno y los paisajes más impresionantes del fin del mundo.",
        "destination": "El Calafate, Argentina",
        "price": Decimal("3500.00"),
        "departure_date": date(2025, 12, 1),
        "duration_days": 14,
        "available_seats": 10,
        "image_url": "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800",
    },
    {
        "title": "Marrakech y el Desierto",
        "description": "Zocos, riads, el Atlas y una noche bajo las estrellas en el Sahara.",
        "destination": "Marrakech, Marruecos",
        "price": Decimal("1350.00"),
        "departure_date": date(2025, 10, 8),
        "duration_days": 7,
        "available_seats": 22,
        "image_url": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800",
    },
    {
        "title": "Fiordos Noruegos",
        "description": "Navega entre acantilados vertiginosos y pueblos vikingos en los fiordos más espectaculares de Europa.",
        "destination": "Bergen, Noruega",
        "price": Decimal("2650.00"),
        "departure_date": date(2025, 8, 3),
        "duration_days": 9,
        "available_seats": 15,
        "image_url": "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800",
    },
]


def seed_database():
    """Insert sample trips if the table is empty."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        if db.query(Trip).count() == 0:
            for trip_data in SAMPLE_TRIPS:
                db.add(Trip(**trip_data))
            db.commit()
            print(f"✅ Seed: {len(SAMPLE_TRIPS)} viajes insertados")
        else:
            print("ℹ️  Seed: La base de datos ya contiene viajes")
    finally:
        db.close()
