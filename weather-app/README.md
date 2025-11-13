# Weather App - Technical Assessment

## Overview
A modern, responsive weather application built with React that provides real-time weather information and 5-day forecasts for any location worldwide. Users can search by city name, zip code, or coordinates, or use their device's geolocation to get instant weather updates.

## Features
- **Current Weather Display**: View real-time weather conditions including temperature, humidity, wind speed, pressure, cloudiness, and visibility
- **5-Day Forecast**: See upcoming weather predictions with daily temperatures and conditions
- **Multiple Search Options**:
  - City name (e.g., "London", "New York")
  - Zip/Postal code (e.g., "10001", "90210")
  - GPS Coordinates (e.g., "51.5074,-0.1278")
- **Geolocation Support**: Get weather for your current location with one click
- **Weather Icons**: Visual representation of weather conditions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive validation and user-friendly error messages
- **PM Accelerator Info**: Learn about the PM Accelerator program

## Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **API**: OpenWeatherMap API
- **State Management**: React Hooks (useState)

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (version 14.0 or higher)
- npm (comes with Node.js)
- A free OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd weather-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
1. Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

   **How to get an API key:**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to your API keys section
   - Copy your API key and paste it in the `.env` file

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Build for Production
```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## API Documentation
This app uses the OpenWeatherMap API:
- **Current Weather API**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast API**: `https://api.openweathermap.org/data/2.5/forecast`
- **Documentation**: https://openweathermap.org/api

## Project Structure
```
weather-app/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── SearchBar.jsx
│   │   ├── CurrentWeather.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── InfoButton.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── utils/          # Utility functions
│   │   └── weatherApi.js
│   ├── App.jsx         # Main app component
│   ├── index.css       # Global styles with Tailwind
│   └── main.jsx        # App entry point
├── .env                # Environment variables (not committed)
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite configuration
└── README.md          # This file
```

## Usage Guide

### Searching for Weather
1. **By City Name**: Enter the city name (e.g., "London", "Tokyo", "New York")
2. **By Zip Code**: Enter a zip code (e.g., "10001" for New York)
3. **By Coordinates**: Enter latitude and longitude separated by a comma (e.g., "51.5074,-0.1278" for London)

### Using Geolocation
Click the "Use My Location" button to automatically detect your current location and display weather information. Note: Your browser will ask for permission to access your location.

## Assessment Completion
- ✅ **Tech Assessment 1**: Complete
  - [x] Location input (city, zip, coordinates)
  - [x] Current weather display
  - [x] 5-day forecast
  - [x] Geolocation support
  - [x] Weather icons
  - [x] Error handling
  - [x] PM Accelerator info
  - [x] Responsive design

- ⬜ **Tech Assessment 2**: Not Started
  - [ ] Database integration (SQL/NoSQL)
  - [ ] CRUD operations
  - [ ] API integrations (YouTube, Google Maps)
  - [ ] Data export (JSON, XML, CSV, PDF, Markdown)

## Features Breakdown

### Current Weather Display
- Temperature (°C)
- Feels like temperature
- Weather description with icon
- Humidity percentage
- Wind speed (m/s)
- Atmospheric pressure (hPa)
- Cloudiness percentage
- Visibility (km)
- Location name and country code
- Date and time

### 5-Day Forecast
Each forecast card displays:
- Day of the week
- Date
- Weather icon
- Average temperature
- Min/max temperatures
- Weather description

### Error Handling
The app handles various error scenarios:
- Invalid location input
- Location not found (404 errors)
- Invalid API key
- Network connectivity issues
- Geolocation permission denied
- Geolocation unavailable
- Request timeouts

## Deployment

### Deploying to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add your environment variables in the Vercel dashboard

### Deploying to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify settings

## Environment Variables
- `VITE_OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)

**Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations
- Free OpenWeatherMap API tier has a rate limit of 60 calls/minute
- Geolocation requires HTTPS (except on localhost)
- Some browsers may block geolocation on insecure connections

## Future Enhancements (Tech Assessment 2)
- Database integration for storing weather queries
- CRUD operations for managing saved locations
- Export functionality (JSON, CSV, PDF)
- Additional API integrations (YouTube, Google Maps)
- User authentication
- Historical weather data
- Weather alerts and notifications

## Troubleshooting

### API Key Issues
- Ensure your API key is correct in the `.env` file
- Wait a few hours after creating a new API key (activation time)
- Check your API key status on OpenWeatherMap dashboard

### Geolocation Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for location access
- Try a different browser

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Ensure Node.js version is 14.0 or higher

## Author
**Aden**

Built as part of the technical assessment for the AI Engineer Intern position at PM Accelerator.

## PM Accelerator Info
The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped hundreds of students fulfill their career aspirations.

Learn more: [Product Manager Accelerator on LinkedIn](https://www.linkedin.com/company/productmanagerinterview/)

## License
This project is created for educational and assessment purposes.

## Acknowledgments
- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [OpenWeatherMap Icons](https://openweathermap.org/weather-conditions)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is Tech Assessment 1 completion. For the full application with database integration and CRUD operations, see Tech Assessment 2 (if implemented).
