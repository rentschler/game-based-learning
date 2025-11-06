from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from ..database import Base


class Landmark(Base):
    __tablename__ = "landmarks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)  # Historic, Military, Architecture, Culture, Royal
    year_established = Column(Integer, nullable=True)
    location = Column(Geometry('POINT', srid=4326), nullable=False, index=True)  # GPS coordinates
    discovery_radius_meters = Column(Integer, default=50)  # Radius for GPS-based discovery
    image_url = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    city = relationship("City", backref="landmarks")
    discoveries = relationship("UserDiscovery", back_populates="landmark")
