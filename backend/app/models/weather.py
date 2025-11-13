from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from sqlalchemy.sql import func
from app.database.config import Base

class WeatherQuery(Base):
    __tablename__ = "weather_queries"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True, nullable=False)
    country = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Date range
    date_from = Column(Date, nullable=False)
    date_to = Column(Date, nullable=False)

    # Weather data
    temperature = Column(Float, nullable=False)
    feels_like = Column(Float, nullable=True)
    temp_min = Column(Float, nullable=True)
    temp_max = Column(Float, nullable=True)
    weather_condition = Column(String, nullable=False)
    weather_description = Column(String, nullable=True)

    # Additional weather details
    humidity = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    cloudiness = Column(Float, nullable=True)
    visibility = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<WeatherQuery(location='{self.location}', temp={self.temperature}°C)>"
