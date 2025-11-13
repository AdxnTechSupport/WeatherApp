from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional

class WeatherQueryBase(BaseModel):
    location: str = Field(..., min_length=1, description="Location name (city, zip, coordinates)")
    country: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)

    date_from: date = Field(..., description="Start date of the query")
    date_to: date = Field(..., description="End date of the query")

    temperature: float = Field(..., description="Temperature in Celsius")
    feels_like: Optional[float] = None
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None
    weather_condition: str = Field(..., min_length=1)
    weather_description: Optional[str] = None

    humidity: Optional[float] = Field(None, ge=0, le=100)
    pressure: Optional[float] = None
    wind_speed: Optional[float] = Field(None, ge=0)
    cloudiness: Optional[float] = Field(None, ge=0, le=100)
    visibility: Optional[float] = Field(None, ge=0)

    @validator('date_to')
    def validate_date_range(cls, v, values):
        if 'date_from' in values and v < values['date_from']:
            raise ValueError('date_to must be greater than or equal to date_from')
        return v

class WeatherQueryCreate(WeatherQueryBase):
    pass

class WeatherQueryUpdate(BaseModel):
    location: Optional[str] = Field(None, min_length=1)
    country: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)

    date_from: Optional[date] = None
    date_to: Optional[date] = None

    temperature: Optional[float] = None
    feels_like: Optional[float] = None
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None
    weather_condition: Optional[str] = Field(None, min_length=1)
    weather_description: Optional[str] = None

    humidity: Optional[float] = Field(None, ge=0, le=100)
    pressure: Optional[float] = None
    wind_speed: Optional[float] = Field(None, ge=0)
    cloudiness: Optional[float] = Field(None, ge=0, le=100)
    visibility: Optional[float] = Field(None, ge=0)

class WeatherQueryResponse(WeatherQueryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
