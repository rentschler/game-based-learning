#!/bin/bash
# Startup script to initialize database and start the application

set -e

echo "🚀 Starting City Explorer Backend Setup..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h db -U cityexplorer -d cityexplorer; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Initialize database (enable PostGIS, create tables)
echo "📦 Initializing database..."
python scripts/init_db.py

# Run Alembic migrations
echo "🔄 Running database migrations..."
alembic upgrade head

# Seed sample data
echo "🌱 Seeding sample data..."
python scripts/seed_data.py

echo "✅ Setup complete! Starting FastAPI server..."

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
