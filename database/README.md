# Database Directory

This directory contains database-related files, initialization scripts, and documentation.

## Structure

- `init/` - Database initialization SQL scripts
- `seeds/` - Sample data SQL scripts (if needed)
- `migrations/` - Database migration documentation (actual migrations are in `backend/alembic/`)

## Database Setup

The database is managed through Docker Compose and initialized automatically by the backend on startup.

### Manual Initialization

If you need to initialize the database manually:

```bash
# From backend directory
python scripts/init_db.py
python scripts/seed_data.py
```

### Database Connection

- **Host**: localhost (or `db` from within Docker network)
- **Port**: 5432
- **Database**: cityexplorer
- **User**: cityexplorer
- **Password**: cityexplorer_password

### PostGIS Extension

PostGIS is automatically enabled on database initialization. The backend handles this through `scripts/init_db.py`.

## Migrations

Database migrations are managed by Alembic and located in `backend/alembic/versions/`.

To create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```
