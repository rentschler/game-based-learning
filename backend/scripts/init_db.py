"""
Initialize the database by enabling PostGIS extension and running migrations.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine, text
from app.config import settings
from app.database import Base
from app.models import User, City, Landmark, UserDiscovery, UserProgress, Region


def init_database():
    """Create database tables and enable PostGIS extension."""
    engine = create_engine(settings.DATABASE_URL)
    
    print("Enabling PostGIS extension...")
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    
    print("Creating database tables...")
    Base.metadata.create_all(engine)
    
    print("Creating spatial indexes...")
    with engine.connect() as conn:
        # Create GIST indexes for geometry columns
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_landmarks_location 
            ON landmarks USING GIST (location);
        """))
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_cities_bounds 
            ON cities USING GIST (bounds);
        """))
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_regions_boundary 
            ON regions USING GIST (boundary);
        """))
        conn.commit()
    
    print("Database initialization complete!")


if __name__ == "__main__":
    init_database()
