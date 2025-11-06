# City Explorer - Backend & Database Setup Guide

This guide explains how to set up and run the City Explorer application with FastAPI backend, PostgreSQL database, and Docker.

## Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

## Quick Start

### 1. Start All Services

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL database** (port 5432) with PostGIS extension
- **FastAPI backend** (port 8000) 
- **React frontend** (port 5173)

### 2. Initialize Database

The database will be automatically initialized on first startup. The backend container runs:
- PostGIS extension setup
- Database table creation
- Sample data seeding (Trondheim and Cologne landmarks)

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## Manual Setup (Without Docker)

If you prefer to run services manually:

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database URL

# Initialize database
python scripts/init_db.py

# Run migrations
alembic upgrade head

# Seed data
python scripts/seed_data.py

# Start server
uvicorn app.main:app --reload
```

### Database Setup

```bash
# Start PostgreSQL with PostGIS
docker run -d \
  --name cityexplorer_db \
  -e POSTGRES_USER=cityexplorer \
  -e POSTGRES_PASSWORD=cityexplorer_password \
  -e POSTGRES_DB=cityexplorer \
  -p 5432:5432 \
  postgis/postgis:15-3.4

# Or use a local PostgreSQL installation with PostGIS extension
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

## Database Schema

### Core Tables

- **users**: User accounts and XP tracking
- **cities**: City information with geographic boundaries
- **landmarks**: Landmarks with PostGIS Point locations
- **user_discoveries**: Discovery records linking users to landmarks
- **user_progress**: Progress tracking per user per city
- **regions**: City regions for unlock mechanics

## API Endpoints

### Landmarks
- `GET /api/v1/landmarks` - List all landmarks
- `GET /api/v1/landmarks/{id}` - Get landmark details
- `GET /api/v1/landmarks/nearby` - Find nearby landmarks (PostGIS query)
- `POST /api/v1/landmarks/{id}/discover` - Discover a landmark

### Discoveries
- `GET /api/v1/users/{user_id}/discoveries` - Get user discoveries
- `GET /api/v1/discoveries/stats` - Discovery statistics

### Progress
- `GET /api/v1/users/{user_id}/progress` - Get all progress
- `GET /api/v1/users/{user_id}/progress/{city_id}` - Get city progress

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user

## Sample Data

The seed script creates:
- **Demo User**: `demo_user` (email: `demo@cityexplorer.com`)
- **Trondheim**: 5 landmarks (Nidaros Cathedral, Kristiansten Fortress, etc.)
- **Cologne**: 2 landmarks (Cologne Cathedral, Hohenzollern Bridge)
- **Sample Discoveries**: First 2 Trondheim landmarks discovered by demo user

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://cityexplorer:cityexplorer_password@db:5432/cityexplorer
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:5173,http://frontend:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL container is running: `docker ps`
- Check database logs: `docker logs cityexplorer_db`
- Verify connection string in `.env`

### PostGIS Extension Errors
- Ensure you're using the PostGIS-enabled PostgreSQL image
- Check that PostGIS is enabled: `psql -U cityexplorer -d cityexplorer -c "SELECT PostGIS_version();"`

### Port Conflicts
- Change ports in `docker-compose.yml` if 5432, 8000, or 5173 are in use
- Update `CORS_ORIGINS` if using different frontend port

### Reset Database
```bash
# Stop containers
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Restart
docker-compose up --build
```

## Development Workflow

1. **Make changes** to backend or frontend code
2. **Hot reload** is enabled - changes reflect automatically
3. **Database migrations**: Use Alembic for schema changes
   ```bash
   alembic revision --autogenerate -m "description"
   alembic upgrade head
   ```

## Next Steps

- Add authentication (JWT tokens)
- Implement OpenAI API for AI summaries
- Add image upload functionality
- Implement quiz system backend
- Add leaderboards and social features

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
