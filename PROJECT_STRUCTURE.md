# Project Structure

This document describes the organized folder structure of the City Explorer application.

## 📁 Root Structure

```
city-explorer/
├── frontend/              # React + Vite frontend application
├── backend/               # FastAPI backend application
├── database/              # Database-related files and scripts
├── docker-compose.yml     # Multi-service Docker configuration
├── README.md              # Main project README
├── QUICKSTART.md          # Quick start guide
├── README_SETUP.md        # Detailed setup instructions
└── .env.example           # Environment variable templates
```

## 📂 Frontend (`frontend/`)

React + TypeScript frontend application.

```
frontend/
├── src/
│   ├── pages/            # React page components
│   │   ├── Explore.tsx
│   │   ├── DiscoveryScanner.tsx
│   │   ├── LandmarkDetail.tsx
│   │   ├── Museum.tsx
│   │   ├── QuizPage.tsx
│   │   └── CologneExplore.tsx
│   ├── services/         # API client and services
│   │   └── api.ts        # Backend API client
│   ├── assets/           # Images and media files
│   ├── App.tsx           # Main app component
│   ├── App.css
│   ├── main.tsx          # Entry point
│   └── index.css
├── public/               # Static assets
│   └── vite.svg
├── package.json          # Dependencies and scripts
├── package-lock.json
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── Dockerfile            # Frontend Dockerfile
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # Frontend documentation
```

## 📂 Backend (`backend/`)

FastAPI backend application with PostgreSQL and PostGIS.

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application entry
│   ├── config.py         # Configuration management
│   ├── database.py       # Database connection & session
│   │
│   ├── models/           # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py       # User model
│   │   ├── city.py       # City model
│   │   ├── landmark.py   # Landmark model
│   │   ├── discovery.py  # UserDiscovery model
│   │   └── progress.py   # UserProgress & Region models
│   │
│   ├── schemas/          # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py       # User request/response schemas
│   │   ├── landmark.py   # Landmark schemas
│   │   ├── discovery.py  # Discovery schemas
│   │   └── progress.py   # Progress schemas
│   │
│   ├── api/              # API routes
│   │   ├── __init__.py
│   │   └── v1/           # API version 1
│   │       ├── __init__.py
│   │       ├── landmarks.py    # Landmark endpoints
│   │       ├── discoveries.py # Discovery endpoints
│   │       ├── progress.py     # Progress endpoints
│   │       └── users.py       # User endpoints
│   │
│   └── services/         # Business logic services
│       ├── __init__.py
│       ├── geospatial_service.py  # PostGIS queries
│       ├── discovery_service.py   # Discovery logic
│       └── progress_service.py    # Progress tracking
│
├── alembic/              # Database migrations (Alembic)
│   ├── env.py            # Alembic environment config
│   ├── script.py.mako    # Migration template
│   └── versions/         # Migration files
│
├── scripts/              # Utility scripts
│   ├── __init__.py
│   ├── init_db.py        # Database initialization
│   ├── seed_data.py      # Sample data seeding
│   └── startup.sh        # Startup script
│
├── Dockerfile            # Backend Dockerfile
├── entrypoint.sh         # Docker entrypoint script
├── requirements.txt      # Python dependencies
├── alembic.ini           # Alembic configuration
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # Backend documentation
```

## 📂 Database (`database/`)

Database-related files, SQL scripts, and documentation.

```
database/
├── init/                  # SQL initialization scripts
│   ├── 01_enable_postgis.sql    # Enable PostGIS extension
│   └── 02_create_indexes.sql    # Create spatial indexes
├── seeds/                # Sample data SQL scripts (optional)
├── migrations/           # Migration documentation
└── README.md             # Database documentation
```

## 🔗 Service Communication

```
┌─────────────┐
│   Frontend  │  (Port 5173)
│  React/Vite │
└──────┬──────┘
       │ HTTP/REST API
       │
┌──────▼──────┐
│   Backend   │  (Port 8000)
│   FastAPI   │
└──────┬──────┘
       │ SQLAlchemy ORM
       │
┌──────▼──────┐
│  Database   │  (Port 5432)
│ PostgreSQL  │
│  + PostGIS  │
└─────────────┘
```

## 🐳 Docker Services

All services are defined in `docker-compose.yml`:

- **frontend**: React development server
- **backend**: FastAPI application
- **db**: PostgreSQL with PostGIS extension

## 📝 Key Files

### Root Level
- `docker-compose.yml` - Orchestrates all services
- `README.md` - Main project documentation
- `.env.example` - Environment variable templates

### Frontend
- `frontend/src/services/api.ts` - API client for backend communication
- `frontend/package.json` - Frontend dependencies

### Backend
- `backend/app/main.py` - FastAPI application entry point
- `backend/app/models/` - Database models
- `backend/app/api/v1/` - API endpoints
- `backend/scripts/init_db.py` - Database initialization
- `backend/scripts/seed_data.py` - Sample data seeding

### Database
- `database/init/` - SQL initialization scripts
- `database/README.md` - Database documentation

## 🚀 Quick Navigation

- **Start development**: `docker-compose up --build`
- **Frontend code**: `frontend/src/`
- **Backend code**: `backend/app/`
- **API endpoints**: `backend/app/api/v1/`
- **Database models**: `backend/app/models/`
- **Migrations**: `backend/alembic/versions/`

## 📚 Documentation

- **[README.md](./README.md)** - Project overview
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[README_SETUP.md](./README_SETUP.md)** - Detailed setup
- **[frontend/README.md](./frontend/README.md)** - Frontend docs
- **[backend/README.md](./backend/README.md)** - Backend docs
- **[database/README.md](./database/README.md)** - Database docs
