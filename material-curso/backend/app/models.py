from sqlalchemy import Column, Integer, String, Text, Numeric, Date, DateTime, func

from .database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    destination = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    departure_date = Column(Date, nullable=False)
    duration_days = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False, default=20)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
