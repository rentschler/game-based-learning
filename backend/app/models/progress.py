from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from ..database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id"), nullable=False, index=True)
    landmarks_discovered = Column(Integer, default=0)
    total_landmarks = Column(Integer, default=0)
    unlocked_regions = Column(ARRAY(UUID(as_uuid=True)), default=[])  # Array of region IDs
    last_visited = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="progress")
    city = relationship("City", backref="user_progress")


class Region(Base):
    __tablename__ = "regions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    boundary = Column(Geometry('POLYGON', srid=4326), nullable=False)  # Region boundary polygon
    unlock_threshold = Column(Integer, default=1)  # Number of landmarks needed to unlock
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    city = relationship("City", backref="regions")
