from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ...database import get_db
from ...models.landmark import Landmark
from ...schemas.landmark import LandmarkResponse, LandmarkNearbyQuery
from ...services.geospatial_service import GeospatialService

router = APIRouter()


@router.get("/landmarks", response_model=List[LandmarkResponse])
def get_landmarks(
    city_id: Optional[UUID] = Query(None, description="Filter by city ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """Get all landmarks, optionally filtered by city or category."""
    query = db.query(Landmark)
    
    if city_id:
        query = query.filter(Landmark.city_id == city_id)
    
    if category:
        query = query.filter(Landmark.category == category)
    
    landmarks = query.all()
    
    # Convert PostGIS points to lat/lon for response
    result = []
    for landmark in landmarks:
        lat, lon = GeospatialService.extract_coordinates(landmark)
        result.append({
            **landmark.__dict__,
            "latitude": lat,
            "longitude": lon
        })
    
    return result


@router.get("/landmarks/{landmark_id}", response_model=LandmarkResponse)
def get_landmark(landmark_id: UUID, db: Session = Depends(get_db)):
    """Get a specific landmark by ID."""
    landmark = db.query(Landmark).filter(Landmark.id == landmark_id).first()
    
    if not landmark:
        raise HTTPException(status_code=404, detail="Landmark not found")
    
    lat, lon = GeospatialService.extract_coordinates(landmark)
    return {
        **landmark.__dict__,
        "latitude": lat,
        "longitude": lon
    }


@router.get("/landmarks/nearby", response_model=List[LandmarkResponse])
def get_nearby_landmarks(
    latitude: float = Query(..., description="User latitude"),
    longitude: float = Query(..., description="User longitude"),
    radius_meters: int = Query(100, description="Search radius in meters"),
    city_id: Optional[UUID] = Query(None, description="Filter by city ID"),
    db: Session = Depends(get_db)
):
    """Find landmarks near a given location using PostGIS."""
    landmarks = GeospatialService.find_nearby_landmarks(
        db=db,
        latitude=latitude,
        longitude=longitude,
        radius_meters=radius_meters,
        city_id=city_id
    )
    
    # Convert PostGIS points to lat/lon for response
    result = []
    for landmark in landmarks:
        lat, lon = GeospatialService.extract_coordinates(landmark)
        result.append({
            **landmark.__dict__,
            "latitude": lat,
            "longitude": lon
        })
    
    return result


@router.post("/landmarks/{landmark_id}/discover")
def discover_landmark(
    landmark_id: UUID,
    user_id: UUID = Query(..., description="User ID"),
    discovery_method: str = Query("ar_scan", description="Discovery method: gps, ar_scan, manual"),
    latitude: Optional[float] = Query(None, description="User latitude when discovered"),
    longitude: Optional[float] = Query(None, description="User longitude when discovered"),
    db: Session = Depends(get_db)
):
    """Mark a landmark as discovered by a user."""
    from ...services.discovery_service import DiscoveryService
    
    # Check if landmark exists
    landmark = db.query(Landmark).filter(Landmark.id == landmark_id).first()
    if not landmark:
        raise HTTPException(status_code=404, detail="Landmark not found")
    
    # Calculate XP (50-100 XP based on category)
    xp_map = {
        "Historic": 100,
        "Military": 90,
        "Architecture": 80,
        "Culture": 70,
        "Royal": 85
    }
    xp_earned = xp_map.get(landmark.category, 50)
    
    # Create discovery
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
    from ...services.progress_service import ProgressService
    ProgressService.update_progress(db, user_id, landmark.city_id)
    
    return {
        "message": "Landmark discovered!",
        "discovery_id": discovery.id,
        "xp_earned": xp_earned
    }
