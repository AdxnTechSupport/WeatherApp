import { useState, useEffect } from 'react';
import { getAllWeatherQueries, deleteWeatherQuery, exportJSON, exportCSV } from '../utils/backendApi';

const SavedWeatherHistory = ({ isDay }) => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');

  // Fetch queries on component mount
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async (location = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllWeatherQueries(0, 100, location);
      setQueries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this weather query?')) {
      return;
    }

    try {
      await deleteWeatherQuery(id);
      // Refresh queries after deletion
      fetchQueries(searchLocation || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQueries(searchLocation || null);
  };

  const handleExportJSON = async () => {
    try {
      await exportJSON();
    } catch (err) {
      setError('Failed to export JSON: ' + err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportCSV();
    } catch (err) {
      setError('Failed to export CSV: ' + err.message);
    }
  };

  const cardBgClass = isDay
    ? 'bg-white/90'
    : 'bg-slate-800/90';

  const textClass = isDay ? 'text-gray-800' : 'text-white';
  const mutedTextClass = isDay ? 'text-gray-600' : 'text-gray-300';

  return (
    <div className={`${cardBgClass} ${textClass} backdrop-blur-lg rounded-3xl p-6 shadow-2xl mb-6`}>
      <h2 className="text-2xl font-bold mb-6">Saved Weather History</h2>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Filter by location..."
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-colors ${
              isDay
                ? 'bg-white border-blue-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
                : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isDay ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'
            }`}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              isDay
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Filter
          </button>
          {searchLocation && (
            <button
              type="button"
              onClick={() => {
                setSearchLocation('');
                fetchQueries(null);
              }}
              className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                isDay
                  ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Export buttons */}
      <div className="mb-6 flex gap-3 justify-end">
        <button
          onClick={handleExportJSON}
          disabled={queries.length === 0}
          className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            queries.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : isDay
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export JSON
        </button>
        <button
          onClick={handleExportCSV}
          disabled={queries.length === 0}
          className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            queries.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : isDay
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDay ? 'border-blue-500' : 'border-purple-500'
          }`}></div>
        </div>
      )}

      {error && (
        <div className={`p-4 mb-4 rounded-lg ${
          isDay ? 'bg-red-100 text-red-800' : 'bg-red-900/50 text-red-200'
        }`}>
          {error}
        </div>
      )}

      {!loading && queries.length === 0 && (
        <div className={`text-center py-8 ${mutedTextClass}`}>
          <p className="text-lg">No saved weather queries yet.</p>
          <p className="text-sm mt-2">Search for weather and click "Save" to store your queries.</p>
        </div>
      )}

      {!loading && queries.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {queries.map((query) => (
            <div
              key={query.id}
              className={`p-4 rounded-xl border-2 transition-colors ${
                isDay
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-slate-700/50 border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {query.location}
                    {query.country && `, ${query.country}`}
                  </h3>
                  <p className={`text-sm ${mutedTextClass} mt-1`}>
                    Saved on {new Date(query.created_at).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div>
                      <p className={`text-xs ${mutedTextClass}`}>Temperature</p>
                      <p className="text-lg font-semibold">{query.temperature}°C</p>
                    </div>
                    <div>
                      <p className={`text-xs ${mutedTextClass}`}>Condition</p>
                      <p className="text-sm font-medium">{query.weather_condition}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${mutedTextClass}`}>Humidity</p>
                      <p className="text-sm">{query.humidity}%</p>
                    </div>
                    <div>
                      <p className={`text-xs ${mutedTextClass}`}>Wind Speed</p>
                      <p className="text-sm">{query.wind_speed} m/s</p>
                    </div>
                  </div>

                  {query.latitude && query.longitude && (
                    <p className={`text-xs ${mutedTextClass} mt-2`}>
                      Coordinates: {query.latitude.toFixed(2)}, {query.longitude.toFixed(2)}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(query.id)}
                  className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDay
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-4 text-sm ${mutedTextClass} text-right`}>
        Total: {queries.length} {queries.length === 1 ? 'query' : 'queries'}
      </div>
    </div>
  );
};

export default SavedWeatherHistory;
