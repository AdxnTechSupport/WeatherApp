import { useState } from 'react';

const DateRangeSearch = ({ onSearch, isDay = true }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before or equal to end date');
      return;
    }

    setLoading(true);
    try {
      await onSearch(location.trim(), startDate, endDate);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = isDay
    ? 'bg-white/20 border-white/30 placeholder-white/70'
    : 'bg-white/10 border-white/20 placeholder-white/50';

  const buttonClass = isDay
    ? 'bg-white/30 hover:bg-white/40'
    : 'bg-white/20 hover:bg-white/30';

  // Calculate min and max dates (today to 3 days ahead - free tier limitation)
  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 3);

  return (
    <div className={`${inputClass} backdrop-blur-sm rounded-2xl p-5 mb-4 transition-colors duration-500`}>
      <h3 className="text-white font-semibold mb-3 text-lg">Search Weather Forecast by Date Range</h3>
      <p className="text-white/70 text-sm mb-4">
        Search weather forecast for today and up to 3 days ahead
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., Toronto, London)..."
          className={`w-full px-4 py-3 ${inputClass} backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all`}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white/70 text-xs mb-1 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate.toISOString().split('T')[0]}
              max={maxDate.toISOString().split('T')[0]}
              className={`w-full px-4 py-3 ${inputClass} backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all`}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-white/70 text-xs mb-1 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={minDate.toISOString().split('T')[0]}
              max={maxDate.toISOString().split('T')[0]}
              className={`w-full px-4 py-3 ${inputClass} backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all`}
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-5 py-3 ${buttonClass} backdrop-blur-sm rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium`}
        >
          {loading ? 'Searching...' : 'Search Date Range'}
        </button>

        {error && (
          <p className="text-red-300 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default DateRangeSearch;
