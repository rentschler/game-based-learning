from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base


class UserDiscovery(Base):
    __tablename__ = "user_discoveries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    landmark_id = Column(UUID(as_uuid=True), ForeignKey("landmarks.id"), nullable=False, index=True)
    discovered_at = Column(DateTime(timezone=True), server_default=func.now())
    xp_earned = Column(Integer, default=0)
    discovery_method = Column(String, nullable=False)  # 'gps', 'ar_scan', 'manual'
    latitude = Column(Float, nullable=True)  # User's location when discovered
    longitude = Column(Float, nullable=True)

    # Relationships
    user = relationship("User", backref="discoveries")
    landmark = relationship("Landmark", back_populates="discoveries")
