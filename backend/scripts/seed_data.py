"""
Seed the database with sample data for Trondheim and Cologne.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.orm import Session
from geoalchemy2 import functions as geo_func
from app.database import SessionLocal, engine
from app.models import User, City, Landmark, UserDiscovery, UserProgress
from app.config import settings
from uuid import uuid4


def seed_data():
    """Seed database with sample data."""
    db = SessionLocal()
    
    try:
        # Create sample user
        print("Creating sample user...")
        user = db.query(User).filter(User.username == "demo_user").first()
        if not user:
            user = User(
                id=uuid4(),
                username="demo_user",
                email="demo@cityexplorer.com",
                total_xp=150,
                level=2
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user: {user.username} (ID: {user.id})")
        else:
            print(f"User already exists: {user.username}")
        
        # Create Trondheim city
        print("Creating Trondheim city...")
        trondheim = db.query(City).filter(City.name == "Trondheim").first()
        if not trondheim:
            trondheim = City(
                id=uuid4(),
                name="Trondheim",
                country="Norway",
                center_latitude=63.4305,
                center_longitude=10.3951
            )
            db.add(trondheim)
            db.commit()
            db.refresh(trondheim)
            print(f"Created city: {trondheim.name} (ID: {trondheim.id})")
        else:
            print(f"City already exists: {trondheim.name}")
        
        # Create Cologne city
        print("Creating Cologne city...")
        cologne = db.query(City).filter(City.name == "Cologne").first()
        if not cologne:
            cologne = City(
                id=uuid4(),
                name="Cologne",
                country="Germany",
                center_latitude=50.9375,
                center_longitude=6.9603
            )
            db.add(cologne)
            db.commit()
            db.refresh(cologne)
            print(f"Created city: {cologne.name} (ID: {cologne.id})")
        else:
            print(f"City already exists: {cologne.name}")
        
        # Trondheim landmarks
        trondheim_landmarks = [
            {
                "name": "Nidaros Cathedral",
                "description": "Norway's national sanctuary and coronation church",
                "category": "Historic",
                "year_established": 1070,
                "latitude": 63.4270,
                "longitude": 10.3969,
                "discovery_radius_meters": 50,
                "ai_summary": "Built over the burial site of St. Olav, Norway's patron saint, this magnificent Gothic cathedral has been the coronation church of Norwegian kings since 1814. Its intricate west façade features over 50 sculptures, making it one of the finest examples of medieval architecture in Scandinavia."
            },
            {
                "name": "Kristiansten Fortress",
                "description": "Historic fortress overlooking Trondheim",
                "category": "Military",
                "year_established": 1681,
                "latitude": 63.4286,
                "longitude": 10.4147,
                "discovery_radius_meters": 50,
                "ai_summary": "Constructed after the great fire of 1681, this fortress played a crucial role in defending Trondheim against Swedish forces in 1718. Today, it offers panoramic views of the city and hosts cultural events throughout the summer."
            },
            {
                "name": "Old Town Bridge",
                "description": "Iconic red bridge connecting city center with Bakklandet",
                "category": "Architecture",
                "year_established": 1861,
                "latitude": 63.4300,
                "longitude": 10.4000,
                "discovery_radius_meters": 30,
                "ai_summary": "Known locally as 'Gamle Bybro,' this iconic red bridge connects the city center with Bakklandet, a picturesque neighborhood of colorful wooden houses. It's often called 'The Gateway to Happiness.'"
            },
            {
                "name": "Rockheim Museum",
                "description": "Norway's national museum of pop and rock music",
                "category": "Culture",
                "year_established": 2010,
                "latitude": 63.4378,
                "longitude": 10.4011,
                "discovery_radius_meters": 50,
                "ai_summary": "Norway's national museum of pop and rock music, featuring interactive exhibits that chronicle Norwegian music from the 1950s to present day. The building's unique architecture resembles a speaker stack."
            },
            {
                "name": "Stiftsgården",
                "description": "One of Scandinavia's largest wooden buildings",
                "category": "Royal",
                "year_established": 1778,
                "latitude": 63.4308,
                "longitude": 10.3936,
                "discovery_radius_meters": 50,
                "ai_summary": "One of Scandinavia's largest wooden buildings, this royal residence was completed in 1778. It serves as the official residence of the Norwegian royal family during visits to Trondheim."
            }
        ]
        
        print("Creating Trondheim landmarks...")
        for lm_data in trondheim_landmarks:
            existing = db.query(Landmark).filter(
                Landmark.name == lm_data["name"],
                Landmark.city_id == trondheim.id
            ).first()
            
            if not existing:
                landmark = Landmark(
                    id=uuid4(),
                    city_id=trondheim.id,
                    name=lm_data["name"],
                    description=lm_data["description"],
                    category=lm_data["category"],
                    year_established=lm_data["year_established"],
                    location=geo_func.ST_SetSRID(
                        geo_func.ST_MakePoint(
                            lm_data["longitude"],
                            lm_data["latitude"]
                        ),
                        4326
                    ),
                    discovery_radius_meters=lm_data["discovery_radius_meters"],
                    ai_summary=lm_data["ai_summary"]
                )
                db.add(landmark)
                print(f"  Created: {lm_data['name']}")
            else:
                print(f"  Already exists: {lm_data['name']}")
        
        db.commit()
        
        # Cologne landmarks
        cologne_landmarks = [
            {
                "name": "Cologne Cathedral",
                "description": "Gothic cathedral and UNESCO World Heritage Site",
                "category": "Historic",
                "year_established": 1248,
                "latitude": 50.9413,
                "longitude": 6.9582,
                "discovery_radius_meters": 50,
                "ai_summary": "A masterpiece of High Gothic architecture, Cologne Cathedral is one of the largest cathedrals in Europe. Construction began in 1248 and took over 600 years to complete. It houses the Shrine of the Three Kings and is a UNESCO World Heritage Site."
            },
            {
                "name": "Hohenzollern Bridge",
                "description": "Famous bridge with love locks",
                "category": "Architecture",
                "year_established": 1911,
                "latitude": 50.9414,
                "longitude": 6.9653,
                "discovery_radius_meters": 50,
                "ai_summary": "This railway and pedestrian bridge spans the Rhine River and is famous for the thousands of love locks attached to its railings. It offers stunning views of Cologne Cathedral and the city skyline."
            }
        ]
        
        print("Creating Cologne landmarks...")
        for lm_data in cologne_landmarks:
            existing = db.query(Landmark).filter(
                Landmark.name == lm_data["name"],
                Landmark.city_id == cologne.id
            ).first()
            
            if not existing:
                landmark = Landmark(
                    id=uuid4(),
                    city_id=cologne.id,
                    name=lm_data["name"],
                    description=lm_data["description"],
                    category=lm_data["category"],
                    year_established=lm_data["year_established"],
                    location=geo_func.ST_SetSRID(
                        geo_func.ST_MakePoint(
                            lm_data["longitude"],
                            lm_data["latitude"]
                        ),
                        4326
                    ),
                    discovery_radius_meters=lm_data["discovery_radius_meters"],
                    ai_summary=lm_data["ai_summary"]
                )
                db.add(landmark)
                print(f"  Created: {lm_data['name']}")
            else:
                print(f"  Already exists: {lm_data['name']}")
        
        db.commit()
        
        # Create sample discoveries for demo user
        print("Creating sample discoveries...")
        trondheim_landmarks_db = db.query(Landmark).filter(
            Landmark.city_id == trondheim.id
        ).all()
        
        # Mark first 2 landmarks as discovered
        discovered_landmarks = trondheim_landmarks_db[:2]
        for landmark in discovered_landmarks:
            existing_discovery = db.query(UserDiscovery).filter(
                UserDiscovery.user_id == user.id,
                UserDiscovery.landmark_id == landmark.id
            ).first()
            
            if not existing_discovery:
                xp_map = {
                    "Historic": 100,
                    "Military": 90,
                    "Architecture": 80,
                    "Culture": 70,
                    "Royal": 85
                }
                xp_earned = xp_map.get(landmark.category, 50)
                
                discovery = UserDiscovery(
                    id=uuid4(),
                    user_id=user.id,
                    landmark_id=landmark.id,
                    discovery_method="ar_scan",
                    xp_earned=xp_earned
                )
                db.add(discovery)
                print(f"  Created discovery: {landmark.name}")
        
        db.commit()
        
        # Create user progress
        print("Creating user progress...")
        from app.services.progress_service import ProgressService
        progress = ProgressService.update_progress(db, user.id, trondheim.id)
        print(f"  Progress created: {progress.landmarks_discovered}/{progress.total_landmarks} landmarks")
        
        print("\n✅ Database seeding complete!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
