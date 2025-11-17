import { useState, useRef } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastCard from './components/ForecastCard';
import InfoButton from './components/InfoButton';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherDetails from './components/WeatherDetails';
import WeatherMap from './components/WeatherMap';
import SavedWeatherHistory from './components/SavedWeatherHistory';
import DateRangeSearch from './components/DateRangeSearch';
import DateRangeResults from './components/DateRangeResults';
import { getCurrentWeather, getForecast, getWeatherByCoords } from './utils/weatherApi';
import { createWeatherQuery, transformWeatherForBackend } from './utils/backendApi';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [dateRangeResults, setDateRangeResults] = useState(null);
  const historyRef = useRef(null);

  const saveToHistory = async (weatherData) => {
    try {
      const backendData = transformWeatherForBackend(weatherData);
      await createWeatherQuery(backendData);
      // Trigger history refresh
      setHistoryRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  const handleSearch = async (location) => {
    setLoading(true);
    setError('');

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(location),
        getForecast(location)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);

      // Automatically save to history
      await saveToHistory(weatherData);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoords(latitude, longitude);

          setCurrentWeather(data.current);
          setForecast(data.forecast);

          // Automatically save to history
          await saveToHistory(data.current);
        } catch (err) {
          setError(err.message);
          setCurrentWeather(null);
          setForecast(null);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
        }

        setError(errorMessage);
        setLoading(false);
      }
    );
  };

  const handleDateRangeSearch = async (location, startDate, endDate) => {
    setError('');
    setDateRangeResults(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const url = `${API_BASE_URL}/api/weather/search-range?location=${encodeURIComponent(location)}&start_date=${startDate}&end_date=${endDate}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch date range data');
      }

      const data = await response.json();
      setDateRangeResults(data);

      // Trigger history refresh since data was saved
      setHistoryRefreshKey((prev) => prev + 1);
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch date range data');
    }
  };

  // Determine if it's day or night based on weather data
  const isDay = currentWeather?.isDay !== false; // Default to day if no data

  // Dynamic background based on day/night
  const backgroundClass = isDay
    ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';

  return (
    <div className={`min-h-screen ${backgroundClass} py-8 px-4 transition-colors duration-500`}>
      <InfoButton />

      <div className="max-w-6xl mx-auto">
        <div className="w-full max-w-md mx-auto">
          <SearchBar
            onSearch={handleSearch}
            onUseLocation={handleUseLocation}
            loading={loading}
            isDay={isDay}
          />

          {error && <ErrorMessage message={error} isDay={isDay} />}

          {loading && <LoadingSpinner isDay={isDay} />}

          {!loading && currentWeather && (
            <>
              <WeatherAlerts alerts={currentWeather.alerts} isDay={isDay} />
              <CurrentWeather data={currentWeather} isDay={isDay} />
              {forecast && <ForecastCard forecast={forecast} isDay={isDay} />}
              <WeatherDetails data={currentWeather} isDay={isDay} />
              <WeatherMap weatherData={currentWeather} isDay={isDay} />
            </>
          )}

          {/* Date Range Search Section */}
          <DateRangeSearch onSearch={handleDateRangeSearch} isDay={isDay} />
          {dateRangeResults && <DateRangeResults data={dateRangeResults} isDay={isDay} />}

          {!loading && !currentWeather && !error && (
            <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-8 text-center text-white shadow-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <p className="text-xl">Enter a location to get started</p>
            </div>
          )}

          <footer className="text-center text-gray-400 mt-6">
            <p className="text-xs">
              Powered by WeatherAPI | Built for PM Accelerator
            </p>
          </footer>
        </div>

        {/* Saved Weather History Section */}
        <div ref={historyRef} className="mt-8 max-w-4xl mx-auto">
          <SavedWeatherHistory key={historyRefreshKey} isDay={isDay} />
        </div>
      </div>
    </div>
  );
}

export default App;
