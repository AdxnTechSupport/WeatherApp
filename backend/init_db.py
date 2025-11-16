"""
Initialize database tables in Supabase.
Run this script once to create all necessary tables.
"""
from app.database.config import engine, Base
from app.models.weather import WeatherQuery

def init_database():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    print("\nTables created:")
    print("  - weather_queries")

if __name__ == "__main__":
    init_database()
