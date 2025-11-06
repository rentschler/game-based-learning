# Quick Start Guide

Get City Explorer up and running in 3 steps!

## 🚀 Quick Start

### 1. Start All Services

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database with PostGIS (port 5432)
- Start FastAPI backend (port 8000)
- Start React frontend (port 5173)
- Automatically initialize the database with sample data

### 2. Wait for Initialization

The backend will automatically:
- ✅ Enable PostGIS extension
- ✅ Create all database tables
- ✅ Run migrations
- ✅ Seed sample data (Trondheim & Cologne landmarks)

Look for these messages in the logs:
```
✅ Database is ready!
📦 Initializing database...
🌱 Seeding sample data...
🚀 Starting FastAPI server...
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

## 🧪 Test the API

### Using Swagger UI

1. Visit http://localhost:8000/docs
2. Try the endpoints interactively
3. Example: `GET /api/v1/landmarks` to see all landmarks

### Using curl

```bash
# Get all landmarks
curl http://localhost:8000/api/v1/landmarks

# Get nearby landmarks (Trondheim center)
curl "http://localhost:8000/api/v1/landmarks/nearby?latitude=63.4305&longitude=10.3951&radius_meters=1000"

# Get user progress (use demo user ID from seed data)
curl http://localhost:8000/api/v1/users/{user_id}/progress
```

## 📊 Sample Data

After initialization, you'll have:

- **Demo User**: `demo_user` (check API for user ID)
- **Trondheim**: 5 landmarks
  - Nidaros Cathedral (discovered)
  - Kristiansten Fortress (discovered)
  - Old Town Bridge
  - Rockheim Museum
  - Stiftsgården
- **Cologne**: 2 landmarks
  - Cologne Cathedral
  - Hohenzollern Bridge

## 🔄 Restart Services

```bash
# Stop all services
docker-compose down

# Start again (data persists)
docker-compose up

# Reset everything (deletes data)
docker-compose down -v
docker-compose up --build
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 5432, 8000, or 5173 are in use:

1. Edit `docker-compose.yml`
2. Change the port mappings (e.g., `"8001:8000"`)
3. Update frontend `.env` if backend port changed

### Database Not Ready

```bash
# Check database logs
docker logs cityexplorer_db

# Check backend logs
docker logs cityexplorer_backend
```

### Reset Database

```bash
# Stop and remove volumes
docker-compose down -v

# Restart
docker-compose up --build
```

## 📚 Next Steps

- Read `README_SETUP.md` for detailed setup instructions
- Read `IMPLEMENTATION_PLAN.md` for architecture details
- Check `IMPLEMENTATION_SUMMARY.md` for what's implemented

## 💡 Development Tips

- **Hot Reload**: Both frontend and backend support hot reload
- **Database Changes**: Use Alembic for migrations
- **API Testing**: Use Swagger UI at `/docs`
- **Logs**: Use `docker-compose logs -f` to follow all logs

---

**That's it!** Your City Explorer backend is ready to use! 🎉
