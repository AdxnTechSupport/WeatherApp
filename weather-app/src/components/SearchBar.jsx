import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, onUseLocation, loading, isDay = true }) => {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(location)}`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(data.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setShowSuggestions(false);
    onSearch(location.trim());
  };

  const handleSuggestionClick = (suggestion) => {
    const locationText = `${suggestion.name}, ${suggestion.country}`;
    setLocation(locationText);
    setShowSuggestions(false);
    onSearch(locationText);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
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
        <div className="relative" ref={suggestionRef}>
          <input
            ref={inputRef}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location (e.g., Toronto, London)..."
            className={`w-full px-5 py-4 ${inputClass} backdrop-blur-sm rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all`}
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 ${buttonClass} text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
          >
            {loading ? '...' : 'Search'}
          </button>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={`absolute z-50 w-full mt-2 ${inputClass} backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20`}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-5 py-3 text-left text-white transition-all flex items-center justify-between ${
                    index === selectedIndex
                      ? 'bg-white/30'
                      : 'bg-transparent hover:bg-white/20'
                  } ${index !== suggestions.length - 1 ? 'border-b border-white/10' : ''}`}
                >
                  <div>
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-xs text-white/70">
                      {suggestion.region && `${suggestion.region}, `}
                      {suggestion.country}
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white/50"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator for suggestions */}
          {isLoadingSuggestions && location.trim().length >= 2 && (
            <div className="absolute right-20 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          )}
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
