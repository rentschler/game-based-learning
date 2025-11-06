from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ...database import get_db
from ...schemas.discovery import DiscoveryResponse
from ...services.discovery_service import DiscoveryService

router = APIRouter()


@router.get("/users/{user_id}/discoveries", response_model=List[DiscoveryResponse])
def get_user_discoveries(
    user_id: UUID,
    city_id: Optional[UUID] = Query(None, description="Filter by city ID"),
    db: Session = Depends(get_db)
):
    """Get all discoveries for a user."""
    discoveries = DiscoveryService.get_user_discoveries(
        db=db,
        user_id=user_id,
        city_id=city_id
    )
    return discoveries


@router.post("/discoveries", response_model=DiscoveryResponse)
def create_discovery(
    user_id: UUID = Query(..., description="User ID"),
    landmark_id: UUID = Query(..., description="Landmark ID"),
    discovery_method: str = Query("ar_scan", description="Discovery method"),
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    xp_earned: int = Query(0, description="XP earned"),
    db: Session = Depends(get_db)
):
    """Create a new discovery record."""
    discovery = DiscoveryService.create_discovery(
        db=db,
        user_id=user_id,
        landmark_id=landmark_id,
        discovery_method=discovery_method,
        latitude=latitude,
        longitude=longitude,
        xp_earned=xp_earned
    )
    
    # Update progress
    from ...models.landmark import Landmark
    landmark = db.query(Landmark).filter(Landmark.id == landmark_id).first()
    if landmark:
        from ...services.progress_service import ProgressService
        ProgressService.update_progress(db, user_id, landmark.city_id)
    
    return discovery


@router.get("/discoveries/stats")
def get_discovery_stats(
    user_id: UUID = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Get discovery statistics for a user."""
    from ...models.discovery import UserDiscovery
    from ...models.user import User
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    total_discoveries = db.query(UserDiscovery).filter(
        UserDiscovery.user_id == user_id
    ).count()
    
    return {
        "user_id": user_id,
        "total_discoveries": total_discoveries,
        "total_xp": user.total_xp,
        "level": user.level
    }
