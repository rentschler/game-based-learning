from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from ..models.progress import UserProgress
from ..models.landmark import Landmark
from ..models.discovery import UserDiscovery


class ProgressService:
    @staticmethod
    def get_or_create_progress(
        db: Session,
        user_id: UUID,
        city_id: UUID
    ) -> UserProgress:
        """
        Get existing progress or create a new one for a user in a city.
        """
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.city_id == city_id
        ).first()
        
        if not progress:
            # Count total landmarks in city
            total_landmarks = db.query(Landmark).filter(
                Landmark.city_id == city_id
            ).count()
            
            progress = UserProgress(
                user_id=user_id,
                city_id=city_id,
                total_landmarks=total_landmarks,
                landmarks_discovered=0
            )
            db.add(progress)
            db.commit()
            db.refresh(progress)
        
        return progress
    
    @staticmethod
    def update_progress(
        db: Session,
        user_id: UUID,
        city_id: UUID
    ) -> UserProgress:
        """
        Update progress based on current discoveries.
        """
        progress = ProgressService.get_or_create_progress(db, user_id, city_id)
        
        # Count discovered landmarks
        discovered_count = db.query(UserDiscovery).join(Landmark).filter(
            UserDiscovery.user_id == user_id,
            Landmark.city_id == city_id
        ).count()
        
        # Update total landmarks count (in case new landmarks were added)
        total_landmarks = db.query(Landmark).filter(
            Landmark.city_id == city_id
        ).count()
        
        progress.landmarks_discovered = discovered_count
        progress.total_landmarks = total_landmarks
        progress.last_visited = datetime.utcnow()
        
        db.commit()
        db.refresh(progress)
        
        return progress
