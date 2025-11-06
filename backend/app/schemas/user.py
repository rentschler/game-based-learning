from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    created_at: datetime
    total_xp: int
    level: int

    class Config:
        from_attributes = True
