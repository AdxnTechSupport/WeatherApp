from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime, timedelta
import csv
import json
from io import StringIO
import os
import requests

from app.database.config import get_db
from app.models.weather import WeatherQuery
from app.schemas.weather import WeatherQueryCreate, WeatherQueryUpdate, WeatherQueryResponse

router = APIRouter(prefix="/api/weather", tags=["weather"])

# WeatherAPI.com configuration
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_API_BASE = "https://api.weatherapi.com/v1"

# SEARCH - Fetch weather data for a date range
@router.get("/search-range")
def search_weather_range(
    location: str = Query(..., description="Location to search for"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Fetch weather data for a location within a date range.

    - Supports historical data (past dates)
    - Supports forecast data (future dates, up to 14 days)
    - Stores each day's data in the database
    - Returns temperature data for all days in range
    """
    if not WEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    try:
        # Parse dates
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
        today = datetime.now().date()

        if start > end:
            raise HTTPException(status_code=400, detail="start_date must be before or equal to end_date")

        # WeatherAPI.com free tier limitations:
        # - Historical data requires paid plan
        # - Forecast available for up to 14 days (but free tier only 3 days)
        # Check if trying to access historical data
        if start < today:
            raise HTTPException(
                status_code=400,
                detail="Historical weather data requires a paid API plan. Please select today or future dates (up to 3 days ahead)."
            )

        # Check if date range is too large (free tier: 3 days forecast)
        if (end - start).days > 3:
            raise HTTPException(status_code=400, detail="Date range cannot exceed 3 days for free tier")

        # Check if end date is too far in future (free tier: 3 days)
        if (end - today).days > 3:
            raise HTTPException(
                status_code=400,
                detail="Forecast only available up to 3 days ahead on free tier. Please select dates within the next 3 days."
            )

        results = []
        current_date = start

        # Fetch forecast data for the entire range (up to 3 days)
        try:
            days_ahead = (end - today).days + 1
            url = f"{WEATHER_API_BASE}/forecast.json"
            params = {
                "key": WEATHER_API_KEY,
                "q": location,
                "days": min(days_ahead, 3)
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            location_data = data["location"]

        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

        # Process each day in the date range
        while current_date <= end:
            try:
                # Find the forecast day for this date
                forecast_day = None
                for day in data["forecast"]["forecastday"]:
                    if day["date"] == current_date.strftime("%Y-%m-%d"):
                        forecast_day = day
                        break

                if not forecast_day:
                    current_date += timedelta(days=1)
                    continue

                day_data = forecast_day["day"]

                weather_record = WeatherQuery(
                    location=location_data["name"],
                    country=location_data["country"],
                    latitude=location_data["lat"],
                    longitude=location_data["lon"],
                    date_from=current_date,
                    date_to=current_date,
                    temperature=day_data["avgtemp_c"],
                    temp_min=day_data["mintemp_c"],
                    temp_max=day_data["maxtemp_c"],
                    weather_condition=day_data["condition"]["text"],
                    weather_description=day_data["condition"]["text"],
                    humidity=day_data.get("avghumidity"),
                    wind_speed=day_data.get("maxwind_kph", 0) / 3.6 if day_data.get("maxwind_kph") else None
                )

                # Store in database
                db.add(weather_record)
                db.commit()
                db.refresh(weather_record)

                results.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "temperature": weather_record.temperature,
                    "temp_min": weather_record.temp_min,
                    "temp_max": weather_record.temp_max,
                    "condition": weather_record.weather_condition,
                    "humidity": weather_record.humidity,
                    "wind_speed": weather_record.wind_speed
                })

            except Exception as e:
                # Log error but continue with next date
                print(f"Error processing date {current_date}: {str(e)}")

            current_date += timedelta(days=1)

        return {
            "location": location,
            "start_date": start_date,
            "end_date": end_date,
            "data": results
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

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
