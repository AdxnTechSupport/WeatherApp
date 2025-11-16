# Weather App - PM Accelerator Technical Assessment

A full-stack weather application built with React and FastAPI, featuring real-time weather data, 5-day forecasts, and database persistence.

Weather app made for PM Accelerator AI Engineer Internship

## Features

### Tech Assessment 1 - Weather App
- Multi-format location search (city name, zip code, GPS coordinates)
- Real-time current weather display
- 5-day weather forecast
- Browser geolocation support
- Custom weather icons
- Day/night theme switching based on location time
- Interactive weather maps with Leaflet
- Weather alerts integration
- Detailed weather metrics (humidity, pressure, wind speed, etc.)

### Tech Assessment 2 - Backend & Database
- RESTful API with FastAPI
- Full CRUD operations for weather queries
- SQLite database (cloud-ready for PostgreSQL)
- Data validation with Pydantic
- Automatic history saving on every search
- Location filtering and search
- Data export (JSON, CSV)
- Real-time history updates

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- WeatherAPI.com for weather data
- Leaflet for interactive maps
- Responsive design

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite (production-ready for PostgreSQL)
- Pydantic for validation
- CORS middleware

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python 3.13+
- WeatherAPI.com API key (free tier)

### Frontend Setup

```bash
cd weather-app
npm install
```

Create `.env` file:
```env
VITE_OPENWEATHER_API_KEY=your_weatherapi_key_here
```

Run development server:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```env
DATABASE_URL=sqlite:///./weather.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

Run development server:
```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Usage

1. Start both frontend and backend servers
2. Open `http://localhost:5173` in your browser
3. Search for any location or use geolocation
4. View current weather, 5-day forecast, and details
5. Weather automatically saves to history
6. Filter history by location
7. Delete saved entries as needed

## API Endpoints

- `POST /api/weather/` - Create new weather query
- `GET /api/weather/` - Get all queries (with pagination & filtering)
- `GET /api/weather/{id}` - Get specific query
- `PUT /api/weather/{id}` - Update query
- `DELETE /api/weather/{id}` - Delete query
- `GET /api/weather/export/json` - Export as JSON
- `GET /api/weather/export/csv` - Export as CSV

## Cloud Database Setup (Supabase)

### Setting Up Supabase Database

1. **Create Supabase Account**
   - Go to https://supabase.com and sign up (free tier)
   - Click "New Project"
   - Fill in project name and database password (save this!)
   - Choose region closest to you

2. **Get Connection String**
   - In Supabase dashboard, go to Settings → Database
   - Find "Connection string" section
   - Select "URI" tab
   - Copy the connection string (looks like: `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`)
   - Replace `[password]` with your actual database password

3. **Configure Backend**
   - Update `DATABASE_URL` in `backend/.env` with your Supabase connection string
   - Install PostgreSQL adapter: `pip install psycopg2-binary`
   - Run initialization script: `python backend/init_db.py`

4. **Verify Connection**
   - Start backend server: `uvicorn app.main:app --reload`
   - Check http://localhost:8000/docs to verify API is running
   - All weather searches will now save to your Supabase database

### Optional: Deploy Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Optional: Deploy Frontend (Vercel)
1. Connect GitHub repository
2. Set `VITE_OPENWEATHER_API_KEY` environment variable
3. Update `backendApi.js` with production backend URL
4. Deploy

## Project Structure

```
Weather App/
├── weather-app/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── utils/        # API utilities
│   │   └── App.jsx       # Main app component
│   ├── public/           # Custom weather icons
│   └── package.json
│
├── backend/              # Backend (FastAPI)
│   ├── app/
│   │   ├── database/     # Database configuration
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routes/       # API routes
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py       # FastAPI app
│   └── requirements.txt
│
└── README.md
```

## Environment Variables

### Frontend (.env)
- `VITE_OPENWEATHER_API_KEY` - WeatherAPI.com API key

### Backend (.env)
- `DATABASE_URL` - Database connection string
- `CORS_ORIGINS` - Allowed frontend origins
- `ENVIRONMENT` - Development/production

## Developer

Built by Aden for PM Accelerator Technical Assessment

## License

This project is for educational and assessment purposes.
