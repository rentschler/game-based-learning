from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional


class ProgressResponse(BaseModel):
    id: UUID
    user_id: UUID
    city_id: UUID
    landmarks_discovered: int
    total_landmarks: int
    unlocked_regions: List[UUID]
    last_visited: Optional[datetime]
    updated_at: datetime

    class Config:
        from_attributes = True


class ProgressUpdate(BaseModel):
    landmarks_discovered: Optional[int] = None
    total_landmarks: Optional[int] = None
    unlocked_regions: Optional[List[UUID]] = None
