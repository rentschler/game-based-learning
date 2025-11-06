from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2 import functions as geo_func
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from typing import List, Optional, Tuple
from uuid import UUID
from ..models.landmark import Landmark


class GeospatialService:
    @staticmethod
    def find_nearby_landmarks(
        db: Session,
        latitude: float,
        longitude: float,
        radius_meters: int = 100,
        city_id: Optional[UUID] = None
    ) -> List[Landmark]:
        """
        Find landmarks within a specified radius of a point using PostGIS.
        Uses ST_DWithin for efficient spatial queries.
        """
        # Create a point from the user's location
        user_point = func.ST_SetSRID(
            func.ST_MakePoint(longitude, latitude),
            4326
        )
        
        # Use ST_DWithin with geography type for accurate distance in meters
        # Cast geometry to geography for proper distance calculation
        query = db.query(Landmark).filter(
            func.ST_DWithin(
                func.ST_GeographyFromText(func.ST_AsText(Landmark.location)),
                func.ST_GeographyFromText(func.ST_AsText(user_point)),
                radius_meters
            )
        )
        
        if city_id:
            query = query.filter(Landmark.city_id == city_id)
        
        return query.all()
    
    @staticmethod
    def calculate_distance(
        latitude1: float,
        longitude1: float,
        latitude2: float,
        longitude2: float
    ) -> float:
        """
        Calculate distance in meters between two points using Haversine formula.
        """
        from math import radians, cos, sin, asin, sqrt
        
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(
            radians, [latitude1, longitude1, latitude2, longitude2]
        )
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        
        # Earth radius in meters
        r = 6371000
        
        return c * r
    
    @staticmethod
    def extract_coordinates(landmark: Landmark) -> Tuple[float, float]:
        """
        Extract latitude and longitude from a PostGIS Point geometry.
        """
        point = to_shape(landmark.location)
        return (point.y, point.x)  # PostGIS uses (lon, lat), shapely uses (lat, lon)
