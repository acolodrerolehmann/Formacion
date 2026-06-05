from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    destination: str
    price: Decimal
    departure_date: date
    duration_days: int
    available_seats: int = 20
    image_url: Optional[str] = None


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    destination: Optional[str] = None
    price: Optional[Decimal] = None
    departure_date: Optional[date] = None
    duration_days: Optional[int] = None
    available_seats: Optional[int] = None
    image_url: Optional[str] = None


class TripResponse(TripBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
