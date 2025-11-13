# Weather App Backend

FastAPI backend with PostgreSQL for weather data management.

## Features

- ✅ CRUD operations for weather queries
- ✅ Data validation with Pydantic
- ✅ PostgreSQL database (SQLite for local dev)
- ✅ Data export (JSON, CSV)
- ✅ RESTful API design
- ✅ Auto-generated API docs

## Setup

### 1. Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database URL
```

### 3. Run Server

```bash
uvicorn app.main:app --reload
```

Server runs at: `http://localhost:8000`

## API Endpoints

### Weather Queries

- `POST /api/weather` - Create new weather query
- `GET /api/weather` - Get all queries (with pagination)
- `GET /api/weather/{id}` - Get specific query
- `PUT /api/weather/{id}` - Update query
- `DELETE /api/weather/{id}` - Delete query

### Export

- `GET /api/weather/export/json` - Export as JSON
- `GET /api/weather/export/csv` - Export as CSV

### Documentation

- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## Database Schema

```sql
weather_queries:
- id (int, primary key)
- location (string)
- country (string)
- latitude (float)
- longitude (float)
- date_from (date)
- date_to (date)
- temperature (float)
- feels_like (float)
- temp_min (float)
- temp_max (float)
- weather_condition (string)
- weather_description (string)
- humidity (float)
- pressure (float)
- wind_speed (float)
- cloudiness (float)
- visibility (float)
- created_at (datetime)
- updated_at (datetime)
```

## Cloud Database Setup

### Using Supabase

1. Create account at supabase.com
2. Create new project
3. Get connection string
4. Update DATABASE_URL in .env

### Using Neon

1. Create account at neon.tech
2. Create new project
3. Get connection string
4. Update DATABASE_URL in .env

## Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render

1. Connect GitHub repo
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

## Testing

```bash
# Run tests
pytest

# Test coverage
pytest --cov=app
```

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Validation**: Pydantic
- **Server**: Uvicorn
