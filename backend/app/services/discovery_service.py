from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from ..models.discovery import UserDiscovery
from ..models.landmark import Landmark
from ..models.user import User


class DiscoveryService:
    @staticmethod
    def create_discovery(
        db: Session,
        user_id: UUID,
        landmark_id: UUID,
        discovery_method: str,
        latitude: float = None,
        longitude: float = None,
        xp_earned: int = 0
    ) -> UserDiscovery:
        """
        Create a new discovery record and update user XP.
        """
        # Check if discovery already exists
        existing = db.query(UserDiscovery).filter(
            UserDiscovery.user_id == user_id,
            UserDiscovery.landmark_id == landmark_id
        ).first()
        
        if existing:
            return existing
        
        # Create discovery
        discovery = UserDiscovery(
            user_id=user_id,
            landmark_id=landmark_id,
            discovery_method=discovery_method,
            latitude=latitude,
            longitude=longitude,
            xp_earned=xp_earned
        )
        
        db.add(discovery)
        
        # Update user XP
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.total_xp += xp_earned
            # Simple level calculation (100 XP per level)
            user.level = (user.total_xp // 100) + 1
        
        db.commit()
        db.refresh(discovery)
        
        return discovery
    
    @staticmethod
    def get_user_discoveries(
        db: Session,
        user_id: UUID,
        city_id: UUID = None
    ) -> list[UserDiscovery]:
        """
        Get all discoveries for a user, optionally filtered by city.
        """
        query = db.query(UserDiscovery).filter(
            UserDiscovery.user_id == user_id
        )
        
        if city_id:
            query = query.join(Landmark).filter(Landmark.city_id == city_id)
        
        return query.order_by(UserDiscovery.discovered_at.desc()).all()
    
    @staticmethod
    def has_discovered(db: Session, user_id: UUID, landmark_id: UUID) -> bool:
        """
        Check if a user has already discovered a landmark.
        """
        return db.query(UserDiscovery).filter(
            UserDiscovery.user_id == user_id,
            UserDiscovery.landmark_id == landmark_id
        ).first() is not None
