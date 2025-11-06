#!/bin/bash
set -e

echo "🚀 Starting City Explorer Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until pg_isready -h db -U cityexplorer -d cityexplorer 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Initialize database if needed (idempotent)
if [ "$INIT_DB" = "true" ] || [ ! -f /app/.db_initialized ]; then
  echo "📦 Initializing database..."
  python scripts/init_db.py || echo "Database already initialized"
  
  echo "🔄 Running migrations..."
  alembic upgrade head || echo "Migrations already applied"
  
  echo "🌱 Seeding sample data..."
  python scripts/seed_data.py || echo "Data already seeded"
  
  touch /app/.db_initialized
  echo "✅ Database initialization complete!"
fi

echo "🚀 Starting FastAPI server..."
exec "$@"
