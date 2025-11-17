const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Fetch current weather data for a given location
 * @param {string} location - Can be city name, zip code, or coordinates
 * @returns {Promise<Object>} Weather data
 */
export const getCurrentWeather = async (location) => {
  try {
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Location not found. Please check your input and try again.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error('Unable to fetch weather data. Please try again later.');
      }
    }

    const data = await response.json();

    // Transform WeatherAPI.com response to match our component structure
    return {
      name: data.location.name,
      sys: { country: data.location.country },
      coord: {
        lat: data.location.lat,
        lon: data.location.lon
      },
      main: {
        temp: data.current.temp_c,
        feels_like: data.current.feelslike_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb
      },
      weather: [{
        main: data.current.condition.text,
        description: data.current.condition.text,
        icon: data.current.condition.text // Pass condition text for icon mapping
      }],
      wind: { speed: data.current.wind_kph / 3.6 }, // Convert to m/s
      clouds: { all: data.current.cloud },
      visibility: data.current.vis_km * 1000,
      dt: data.location.localtime_epoch,
      isDay: data.current.is_day === 1, // 1 for day, 0 for night
      alerts: data.alerts?.alert || [] // Weather alerts if available
    };
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Fetch 5-day weather forecast
 * @param {string} location - Can be city name, zip code, or coordinates
 * @returns {Promise<Object>} Forecast data
 */
export const getForecast = async (location) => {
  try {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=5`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Location not found. Please check your input and try again.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error('Unable to fetch forecast data. Please try again later.');
      }
    }

    const data = await response.json();

    // Transform WeatherAPI.com forecast to match our component structure
    const dailyForecasts = data.forecast.forecastday.map(day => ({
      dt: new Date(day.date).getTime() / 1000,
      dt_txt: day.date,
      main: {
        temp: day.day.avgtemp_c,
        temp_min: day.day.mintemp_c,
        temp_max: day.day.maxtemp_c
      },
      weather: [{
        main: day.day.condition.text,
        description: day.day.condition.text,
        icon: day.day.condition.text // Pass condition text for icon mapping
      }]
    }));

    return {
      daily: dailyForecasts
    };
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Get weather data by browser geolocation
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const location = `${lat},${lon}`;

    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(location),
      getForecast(location)
    ]);

    return {
      current: currentData,
      forecast: forecastData
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get local weather icon based on condition
 * @param {string} condition - Weather condition text
 * @returns {string} Local icon path
 */
const getLocalWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase();

  // Thunder and storms (highest priority)
  if (conditionLower.includes('thunder') ||
      conditionLower.includes('storm') ||
      conditionLower.includes('lightning')) {
    return '/thunder.png';
  }

  // Heavy rain
  if (conditionLower.includes('heavy rain') ||
      conditionLower.includes('torrential') ||
      conditionLower.includes('pouring') ||
      conditionLower.includes('moderate or heavy rain')) {
    return '/heavy-rain.png';
  }

  // Light snow
  if (conditionLower.includes('light snow') ||
      conditionLower.includes('light snow shower') ||
      conditionLower.includes('patchy light snow') ||
      conditionLower.includes('flurries')) {
    return '/light snow.png';
  }

  // Snow (general)
  if (conditionLower.includes('snow') ||
      conditionLower.includes('blizzard') ||
      conditionLower.includes('sleet') ||
      conditionLower.includes('ice')) {
    return '/snow.png';
  }

  // Rain (general) - maps to heavy-rain as fallback
  if (conditionLower.includes('rain') ||
      conditionLower.includes('drizzle') ||
      conditionLower.includes('shower')) {
    return '/heavy-rain.png';
  }

  // Windy
  if (conditionLower.includes('wind') ||
      conditionLower.includes('gale') ||
      conditionLower.includes('breezy')) {
    return '/wind.png';
  }

  // Cloudy/Partly cloudy
  if (conditionLower.includes('cloudy') ||
      conditionLower.includes('overcast') ||
      conditionLower.includes('partly') ||
      conditionLower.includes('partial') ||
      conditionLower.includes('mist') ||
      conditionLower.includes('fog') ||
      conditionLower.includes('haze')) {
    return '/partially sunny.png';
  }

  // Clear/Sunny
  if (conditionLower.includes('clear') ||
      conditionLower.includes('sunny') ||
      conditionLower.includes('fair')) {
    return '/sun.png';
  }

  // Default to partially sunny for unknown conditions
  return '/partially sunny.png';
};

/**
 * Get weather icon URL
 * @param {string} iconCode - Icon code from API (not used anymore, we use condition text)
 * @returns {string} Icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  // This will now be called with condition text from our transformed data
  return getLocalWeatherIcon(iconCode);
};
