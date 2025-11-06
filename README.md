# City Explorer - Game-Based Learning App

A location-based augmented reality (AR) mobile app that transforms real-world exploration into an engaging educational experience.

## 📁 Project Structure

```
city-explorer/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   └── ...
│
├── backend/          # FastAPI backend application
│   ├── app/          # Application code (models, API, services)
│   ├── alembic/      # Database migrations
│   └── scripts/      # Initialization and seed scripts
│
├── database/         # Database-related files
│   ├── init/         # SQL initialization scripts
│   ├── seeds/        # Sample data SQL scripts
│   └── migrations/   # Migration documentation
│
└── docker-compose.yml  # Multi-service Docker configuration
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed

### Start All Services

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL database** with PostGIS (port 5432)
- **FastAPI backend** (port 8000)
- **React frontend** (port 5173)

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[README_SETUP.md](./README_SETUP.md)** - Detailed setup instructions
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Technical implementation plan
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation summary

## 🏗️ Architecture

### Frontend (`frontend/`)
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- API client for backend communication

### Backend (`backend/`)
- FastAPI framework
- SQLAlchemy ORM
- PostgreSQL with PostGIS extension
- Alembic for database migrations

### Database (`database/`)
- PostgreSQL 15 with PostGIS
- Spatial data support for landmarks
- Initialization scripts

## 🎮 Features

- **Landmark Discovery**: Discover landmarks through GPS or AR scanning
- **Progress Tracking**: Track discoveries per city
- **Geospatial Queries**: Find nearby landmarks using PostGIS
- **XP System**: Earn experience points for discoveries
- **Sample Data**: Pre-loaded with Trondheim and Cologne landmarks

## 🔧 Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## 📝 Environment Variables

### Frontend
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend
Create `backend/.env`:
```env
DATABASE_URL=postgresql://cityexplorer:cityexplorer_password@db:5432/cityexplorer
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:5173,http://frontend:5173
```

## 🐛 Troubleshooting

See [README_SETUP.md](./README_SETUP.md) for detailed troubleshooting guide.

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]
