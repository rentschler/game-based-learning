# Implementation Plan: FastAPI Backend + PostgreSQL + Docker Setup

## Overview
This document outlines the complete implementation plan for adding a FastAPI backend with PostgreSQL (PostGIS) database and Docker containerization to the City Explorer game-based learning app.

---

## 1. Architecture Overview

```
┌─────────────────┐
│   React Frontend │  (Port 5173)
│   (Vite + TS)    │
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│  FastAPI Backend │  (Port 8000)
│  (Python 3.11+)  │
└────────┬────────┘
         │ SQLAlchemy ORM
         │
┌────────▼────────┐
│  PostgreSQL      │  (Port 5432)
│  + PostGIS       │
└─────────────────┘
```

---

## 2. Docker Compose Configuration

### Services:
1. **frontend** - React/Vite app (development server)
2. **backend** - FastAPI application
3. **db** - PostgreSQL 15 with PostGIS extension

### Network:
- All services on a shared Docker network
- Frontend → Backend: `http://backend:8000`
- Backend → Database: `postgresql://user:pass@db:5432/cityexplorer`

### Volumes:
- Database data persistence
- Backend code hot-reload
- Frontend code hot-reload

---

## 3. Database Schema Design

### Core Tables:

#### `users`
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `created_at` (Timestamp)
- `total_xp` (Integer, default 0)
- `level` (Integer, default 1)

#### `cities`
- `id` (UUID, Primary Key)
- `name` (String)
- `country` (String)
- `center_latitude` (Float)
- `center_longitude` (Float)
- `bounds` (PostGIS Polygon) - City boundary
- `created_at` (Timestamp)

#### `landmarks`
- `id` (UUID, Primary Key)
- `city_id` (UUID, Foreign Key → cities)
- `name` (String)
- `description` (Text)
- `category` (String) - Historic, Military, Architecture, Culture, Royal
- `year_established` (Integer, nullable)
- `location` (PostGIS Point) - GPS coordinates
- `discovery_radius_meters` (Integer, default 50)
- `image_url` (String, nullable)
- `ai_summary` (Text, nullable)
- `created_at` (Timestamp)

#### `user_discoveries`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `landmark_id` (UUID, Foreign Key → landmarks)
- `discovered_at` (Timestamp)
- `xp_earned` (Integer)
- `discovery_method` (String) - 'gps', 'ar_scan', 'manual'
- `latitude` (Float) - User's location when discovered
- `longitude` (Float)

#### `user_progress`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `city_id` (UUID, Foreign Key → cities)
- `landmarks_discovered` (Integer, default 0)
- `total_landmarks` (Integer)
- `unlocked_regions` (PostGIS Geometry[]) - Array of polygon regions
- `last_visited` (Timestamp)
- `updated_at` (Timestamp)

#### `regions` (for city region management)
- `id` (UUID, Primary Key)
- `city_id` (UUID, Foreign Key → cities)
- `name` (String)
- `boundary` (PostGIS Polygon)
- `unlock_threshold` (Integer) - Number of landmarks needed to unlock

---

## 4. FastAPI Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection & session
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── city.py
│   │   ├── landmark.py
│   │   ├── discovery.py
│   │   └── progress.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── landmark.py
│   │   ├── discovery.py
│   │   └── progress.py
│   │
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── landmarks.py
│   │   │   ├── discoveries.py
│   │   │   ├── progress.py
│   │   │   └── users.py
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── discovery_service.py
│   │   ├── geospatial_service.py  # PostGIS queries
│   │   └── progress_service.py
│   │
│   └── utils/
│       ├── __init__.py
│       └── geospatial.py       # Geo utilities
│
├── alembic/                    # Database migrations
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── scripts/                    # Initialization scripts
│   ├── init_db.py              # Create tables
│   └── seed_data.py            # Sample landmarks
│
├── requirements.txt
├── Dockerfile
└── .env.example
```

---

## 5. API Endpoints

### Landmarks
- `GET /api/v1/landmarks` - List all landmarks (with filters: city_id, discovered)
- `GET /api/v1/landmarks/{landmark_id}` - Get landmark details
- `GET /api/v1/landmarks/nearby` - Find landmarks near coordinates (PostGIS query)
- `POST /api/v1/landmarks/{landmark_id}/discover` - Mark landmark as discovered

### Discoveries
- `GET /api/v1/users/{user_id}/discoveries` - Get user's discoveries
- `POST /api/v1/discoveries` - Create new discovery record
- `GET /api/v1/discoveries/stats` - Discovery statistics

### Progress
- `GET /api/v1/users/{user_id}/progress` - Get user progress for all cities
- `GET /api/v1/users/{user_id}/progress/{city_id}` - Get progress for specific city
- `PUT /api/v1/users/{user_id}/progress/{city_id}` - Update progress
- `GET /api/v1/users/{user_id}/progress/{city_id}/regions` - Get unlocked regions

### Users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/{user_id}` - Get user profile
- `PUT /api/v1/users/{user_id}` - Update user

---

## 6. PostGIS Integration

### Key Features:
- **Point Queries**: Find landmarks within radius using `ST_DWithin`
- **Region Unlocking**: Store and query polygon regions
- **Distance Calculations**: `ST_Distance` for proximity checks
- **Spatial Indexing**: GIST indexes on geometry columns

### Example Queries:
```sql
-- Find landmarks within 100m of user location
SELECT * FROM landmarks 
WHERE ST_DWithin(
  location, 
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
  100
);

-- Get unlocked regions for a city
SELECT boundary FROM regions 
WHERE city_id = ? 
AND id IN (SELECT unnest(unlocked_regions) FROM user_progress WHERE user_id = ?);
```

---

## 7. Database Initialization

### Scripts:
1. **`init_db.py`**: 
   - Enable PostGIS extension
   - Create all tables via Alembic
   - Set up indexes

2. **`seed_data.py`**:
   - Insert sample cities (Trondheim, Cologne)
   - Insert sample landmarks with PostGIS Point coordinates
   - Create sample user
   - Create sample discoveries

### Sample Data:
- **Trondheim**: 5 landmarks (Nidaros Cathedral, Kristiansten Fortress, etc.)
- **Cologne**: Sample landmarks
- Coordinates in WGS84 (SRID 4326)

---

## 8. Environment Configuration

### Backend `.env`:
```env
DATABASE_URL=postgresql://cityexplorer:password@db:5432/cityexplorer
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://frontend:5173
```

### Frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Docker Compose Environment:
- Database credentials
- Service ports
- Volume mounts

---

## 9. Frontend-Backend Integration

### API Client Setup:
- Create `src/services/api.ts` with axios/fetch wrapper
- Environment-based API URL
- Error handling and response types

### State Management Updates:
- Replace local state with API calls
- Add loading states
- Handle errors gracefully

### Key Integration Points:
1. **Landmark Discovery**: Call `POST /api/v1/landmarks/{id}/discover`
2. **Progress Tracking**: Fetch from `GET /api/v1/users/{id}/progress/{city_id}`
3. **Nearby Landmarks**: Use `GET /api/v1/landmarks/nearby?lat=&lon=&radius=`

---

## 10. Implementation Steps

### Phase 1: Infrastructure Setup
1. ✅ Create Docker Compose file
2. ✅ Create backend directory structure
3. ✅ Set up FastAPI application
4. ✅ Configure PostgreSQL with PostGIS

### Phase 2: Database Layer
1. ✅ Create SQLAlchemy models
2. ✅ Set up Alembic migrations
3. ✅ Create initial migration
4. ✅ Write database initialization scripts
5. ✅ Seed sample data

### Phase 3: API Layer
1. ✅ Create Pydantic schemas
2. ✅ Implement API endpoints
3. ✅ Add PostGIS query services
4. ✅ Error handling and validation

### Phase 4: Integration
1. ✅ Create frontend API client
2. ✅ Update React components to use API
3. ✅ Add environment configuration
4. ✅ Test end-to-end flow

### Phase 5: Dockerization
1. ✅ Create Dockerfiles for frontend and backend
2. ✅ Configure docker-compose.yml
3. ✅ Test containerized setup
4. ✅ Document startup procedures

---

## 11. Testing Strategy

### Backend Tests:
- Unit tests for services
- Integration tests for API endpoints
- PostGIS query validation

### Frontend Tests:
- API client tests
- Component integration tests

### End-to-End:
- Discovery flow
- Progress tracking
- Geospatial queries

---

## 12. Security Considerations

- Environment variables for secrets
- CORS configuration
- Input validation (Pydantic)
- SQL injection prevention (SQLAlchemy ORM)
- Rate limiting (future)

---

## 13. Deployment Notes

### Development:
- Hot-reload for both frontend and backend
- Database persistence via volumes
- Easy reset with `docker-compose down -v`

### Production (Future):
- Separate Dockerfiles for production builds
- Nginx reverse proxy
- SSL/TLS certificates
- Database backups

---

## 14. File Structure Summary

```
/workspace
├── docker-compose.yml
├── .env.example
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/ (structure as above)
│
├── frontend/ (existing React app)
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
│       └── services/
│           └── api.ts
│
└── scripts/
    └── init.sh (optional startup script)
```

---

## Next Steps After Implementation

1. Add authentication (JWT tokens)
2. Implement OpenAI API integration for AI summaries
3. Add image upload for landmarks
4. Implement leaderboards
5. Add quiz system backend
6. Implement teleportation currency system
7. Add social features (friends, sharing)
