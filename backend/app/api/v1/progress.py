from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...database import get_db
from ...schemas.progress import ProgressResponse
from ...services.progress_service import ProgressService

router = APIRouter()


@router.get("/users/{user_id}/progress", response_model=List[ProgressResponse])
def get_user_progress(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Get progress for a user across all cities."""
    from ...models.progress import UserProgress
    
    progress_list = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).all()
    
    return progress_list


@router.get("/users/{user_id}/progress/{city_id}", response_model=ProgressResponse)
def get_city_progress(
    user_id: UUID,
    city_id: UUID,
    db: Session = Depends(get_db)
):
    """Get progress for a user in a specific city."""
    progress = ProgressService.get_or_create_progress(
        db=db,
        user_id=user_id,
        city_id=city_id
    )
    
    # Update progress to ensure it's current
    progress = ProgressService.update_progress(db, user_id, city_id)
    
    return progress


@router.get("/users/{user_id}/progress/{city_id}/regions")
def get_unlocked_regions(
    user_id: UUID,
    city_id: UUID,
    db: Session = Depends(get_db)
):
    """Get unlocked regions for a user in a city."""
    from ...models.progress import UserProgress, Region
    
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.city_id == city_id
    ).first()
    
    if not progress:
        return {"unlocked_regions": []}
    
    if not progress.unlocked_regions:
        return {"unlocked_regions": []}
    
    regions = db.query(Region).filter(
        Region.id.in_(progress.unlocked_regions)
    ).all()
    
    return {
        "unlocked_regions": [
            {
                "id": str(region.id),
                "name": region.name,
                "unlock_threshold": region.unlock_threshold
            }
            for region in regions
        ]
    }
