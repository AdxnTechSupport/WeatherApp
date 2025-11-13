import { useState } from 'react';

const SearchBar = ({ onSearch, onUseLocation, loading, isDay = true }) => {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    onSearch(location.trim());
  };

  // Different styling for day vs night
  const inputClass = isDay
    ? 'bg-white/20 border-white/30 placeholder-white/70'
    : 'bg-white/10 border-white/20 placeholder-white/50';

  const buttonClass = isDay
    ? 'bg-white/30 hover:bg-white/40'
    : 'bg-white/20 hover:bg-white/30';

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search location..."
            className={`w-full px-5 py-4 ${inputClass} backdrop-blur-sm rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 ${buttonClass} text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        <button
          type="button"
          onClick={onUseLocation}
          disabled={loading}
          className={`w-full px-5 py-3 ${inputClass} backdrop-blur-sm rounded-2xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Use My Location
        </button>

        {error && (
          <p className="text-red-300 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
