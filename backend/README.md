# Backend - City Explorer API

FastAPI backend application for City Explorer game-based learning app.

## 🚀 Quick Start

### Development (Local)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python scripts/init_db.py

# Run migrations
alembic upgrade head

# Seed sample data
python scripts/seed_data.py

# Start server
uvicorn app.main:app --reload
```

### Development (Docker)

```bash
# From project root
docker-compose up backend
```

## 📁 Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection
│   │
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── city.py
│   │   ├── landmark.py
│   │   ├── discovery.py
│   │   └── progress.py
│   │
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── landmark.py
│   │   ├── discovery.py
│   │   └── progress.py
│   │
│   ├── api/v1/              # API endpoints
│   │   ├── landmarks.py
│   │   ├── discoveries.py
│   │   ├── progress.py
│   │   └── users.py
│   │
│   └── services/            # Business logic
│       ├── geospatial_service.py
│       ├── discovery_service.py
│       └── progress_service.py
│
├── alembic/                 # Database migrations
│   ├── env.py
│   └── versions/
│
└── scripts/                # Utility scripts
    ├── init_db.py          # Database initialization
    └── seed_data.py        # Sample data seeding
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
DATABASE_URL=postgresql://cityexplorer:cityexplorer_password@db:5432/cityexplorer
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:5173,http://frontend:5173
```

## 🗄️ Database

### Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Initialize Database

```bash
python scripts/init_db.py
```

### Seed Sample Data

```bash
python scripts/seed_data.py
```

## 📡 API Endpoints

### Landmarks
- `GET /api/v1/landmarks` - List all landmarks
- `GET /api/v1/landmarks/{id}` - Get landmark details
- `GET /api/v1/landmarks/nearby` - Find nearby landmarks
- `POST /api/v1/landmarks/{id}/discover` - Discover a landmark

### Discoveries
- `GET /api/v1/users/{user_id}/discoveries` - Get user discoveries
- `POST /api/v1/discoveries` - Create discovery
- `GET /api/v1/discoveries/stats` - Get statistics

### Progress
- `GET /api/v1/users/{user_id}/progress` - Get all progress
- `GET /api/v1/users/{user_id}/progress/{city_id}` - Get city progress

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user

## 📚 API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest

# Test specific endpoint
curl http://localhost:8000/api/v1/landmarks
```

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database credentials

### PostGIS Extension

PostGIS is automatically enabled on initialization. If issues occur:
```bash
python scripts/init_db.py
```

### CORS Errors

Update `CORS_ORIGINS` in `.env` to include your frontend URL.
