from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class LandmarkCreate(BaseModel):
    city_id: UUID
    name: str
    description: Optional[str] = None
    category: str
    year_established: Optional[int] = None
    latitude: float
    longitude: float
    discovery_radius_meters: int = 50
    image_url: Optional[str] = None
    ai_summary: Optional[str] = None


class LandmarkResponse(BaseModel):
    id: UUID
    city_id: UUID
    name: str
    description: Optional[str]
    category: str
    year_established: Optional[int]
    latitude: float
    longitude: float
    discovery_radius_meters: int
    image_url: Optional[str]
    ai_summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class LandmarkNearbyQuery(BaseModel):
    latitude: float
    longitude: float
    radius_meters: int = 100
    city_id: Optional[UUID] = None
