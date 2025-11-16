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

## Developer

Built by Aden for PM Accelerator Technical Assessment

## License

This project is for educational and assessment purposes.
