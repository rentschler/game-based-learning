from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class DiscoveryCreate(BaseModel):
    user_id: UUID
    landmark_id: UUID
    discovery_method: str  # 'gps', 'ar_scan', 'manual'
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    xp_earned: int = 0


class DiscoveryResponse(BaseModel):
    id: UUID
    user_id: UUID
    landmark_id: UUID
    discovered_at: datetime
    xp_earned: int
    discovery_method: str
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True
