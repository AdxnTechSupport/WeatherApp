from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import csv
import json
from io import StringIO

from app.database.config import get_db
from app.models.weather import WeatherQuery
from app.schemas.weather import WeatherQueryCreate, WeatherQueryUpdate, WeatherQueryResponse

router = APIRouter(prefix="/api/weather", tags=["weather"])

# CREATE - Add new weather query
@router.post("/", response_model=WeatherQueryResponse, status_code=201)
def create_weather_query(
    weather: WeatherQueryCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new weather query record.

    - Validates location and date range
    - Stores weather data in database
    """
    db_weather = WeatherQuery(**weather.model_dump())
    db.add(db_weather)
    db.commit()
    db.refresh(db_weather)
    return db_weather

# READ - Get all weather queries
@router.get("/", response_model=List[WeatherQueryResponse])
def get_weather_queries(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    location: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Retrieve all weather queries with optional filtering.

    - Supports pagination (skip, limit)
    - Filter by location (optional)
    """
    query = db.query(WeatherQuery)

    if location:
        query = query.filter(WeatherQuery.location.ilike(f"%{location}%"))

    # Order by created_at descending (most recent first)
    weather_queries = query.order_by(WeatherQuery.created_at.desc()).offset(skip).limit(limit).all()
    return weather_queries

# READ - Get specific weather query by ID
@router.get("/{query_id}", response_model=WeatherQueryResponse)
def get_weather_query(
    query_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific weather query by ID.
    """
    weather_query = db.query(WeatherQuery).filter(WeatherQuery.id == query_id).first()

    if not weather_query:
        raise HTTPException(status_code=404, detail="Weather query not found")

    return weather_query

# UPDATE - Update weather query
@router.put("/{query_id}", response_model=WeatherQueryResponse)
def update_weather_query(
    query_id: int,
    weather_update: WeatherQueryUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing weather query.

    - Validates updated data
    - Only updates provided fields
    """
    db_weather = db.query(WeatherQuery).filter(WeatherQuery.id == query_id).first()

    if not db_weather:
        raise HTTPException(status_code=404, detail="Weather query not found")

    # Update only provided fields
    update_data = weather_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_weather, field, value)

    db.commit()
    db.refresh(db_weather)
    return db_weather

# DELETE - Delete weather query
@router.delete("/{query_id}", status_code=204)
def delete_weather_query(
    query_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a weather query by ID.
    """
    db_weather = db.query(WeatherQuery).filter(WeatherQuery.id == query_id).first()

    if not db_weather:
        raise HTTPException(status_code=404, detail="Weather query not found")

    db.delete(db_weather)
    db.commit()
    return Response(status_code=204)

# EXPORT - Export data as JSON
@router.get("/export/json", response_model=List[WeatherQueryResponse])
def export_json(
    db: Session = Depends(get_db)
):
    """
    Export all weather queries as JSON.
    """
    weather_queries = db.query(WeatherQuery).all()
    return weather_queries

# EXPORT - Export data as CSV
@router.get("/export/csv")
def export_csv(
    db: Session = Depends(get_db)
):
    """
    Export all weather queries as CSV.
    """
    weather_queries = db.query(WeatherQuery).all()

    if not weather_queries:
        return Response(content="", media_type="text/csv")

    # Create CSV
    output = StringIO()
    writer = csv.writer(output)

    # Write header
    writer.writerow([
        "ID", "Location", "Country", "Latitude", "Longitude",
        "Date From", "Date To", "Temperature", "Feels Like",
        "Weather Condition", "Humidity", "Pressure", "Wind Speed",
        "Created At"
    ])

    # Write data
    for query in weather_queries:
        writer.writerow([
            query.id, query.location, query.country,
            query.latitude, query.longitude,
            query.date_from, query.date_to,
            query.temperature, query.feels_like,
            query.weather_condition,
            query.humidity, query.pressure, query.wind_speed,
            query.created_at
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=weather_data.csv"}
    )
