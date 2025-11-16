const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/weather`
  : 'http://localhost:8000/api/weather';

// Create a new weather query
export const createWeatherQuery = async (weatherData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(weatherData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to save weather query');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating weather query:', error);
    throw error;
  }
};

// Get all weather queries
export const getAllWeatherQueries = async (skip = 0, limit = 100, location = null) => {
  try {
    let url = `${API_BASE_URL}?skip=${skip}&limit=${limit}`;
    if (location) {
      url += `&location=${encodeURIComponent(location)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch weather queries');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather queries:', error);
    throw error;
  }
};

// Get a specific weather query by ID
export const getWeatherQuery = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Weather query not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather query:', error);
    throw error;
  }
};

// Update a weather query
export const updateWeatherQuery = async (id, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update weather query');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating weather query:', error);
    throw error;
  }
};

// Delete a weather query
export const deleteWeatherQuery = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete weather query');
    }

    return true;
  } catch (error) {
    console.error('Error deleting weather query:', error);
    throw error;
  }
};

// Export data as JSON
export const exportJSON = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/export/json`);

    if (!response.ok) {
      throw new Error('Failed to export JSON');
    }

    const data = await response.json();

    // Download as file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return data;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw error;
  }
};

// Export data as CSV
export const exportCSV = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/export/csv`);

    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};

// Transform current weather data to backend schema
export const transformWeatherForBackend = (weatherData) => {
  const today = new Date().toISOString().split('T')[0];

  return {
    location: weatherData.name || 'Unknown',
    country: weatherData.sys?.country || '',
    latitude: weatherData.coord?.lat || 0,
    longitude: weatherData.coord?.lon || 0,
    date_from: today,
    date_to: today,
    temperature: weatherData.main?.temp || 0,
    feels_like: weatherData.main?.feels_like || null,
    temp_min: weatherData.main?.temp_min || null,
    temp_max: weatherData.main?.temp_max || null,
    weather_condition: weatherData.weather?.[0]?.main || 'Unknown',
    weather_description: weatherData.weather?.[0]?.description || null,
    humidity: weatherData.main?.humidity || null,
    pressure: weatherData.main?.pressure || null,
    wind_speed: weatherData.wind?.speed || null,
    cloudiness: weatherData.clouds?.all || null,
    visibility: weatherData.visibility || null,
  };
};
