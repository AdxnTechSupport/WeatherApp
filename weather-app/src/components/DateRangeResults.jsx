const DateRangeResults = ({ data, isDay }) => {
  if (!data || !data.data || data.data.length === 0) return null;

  const gradientClass = isDay
    ? 'bg-blue-500/30'
    : 'bg-indigo-800/30';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`${gradientClass} backdrop-blur-sm rounded-2xl p-5 mb-4 transition-colors duration-500`}>
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg">{data.location}</h3>
        <p className="text-white/70 text-sm">
          {formatDate(data.start_date)} - {formatDate(data.end_date)}
        </p>
      </div>

      <div className="space-y-3">
        {data.data.map((dayData, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/15"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-white font-medium">{formatDate(dayData.date)}</p>
                <p className="text-white/70 text-sm capitalize">{dayData.condition}</p>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-bold">
                  {Math.round(dayData.temperature)}°C
                </div>
                {dayData.temp_min !== null && dayData.temp_max !== null && (
                  <div className="text-white/70 text-xs">
                    {Math.round(dayData.temp_min)}° / {Math.round(dayData.temp_max)}°
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
              {dayData.humidity !== null && (
                <div className="text-center">
                  <p className="text-white/70 text-xs">Humidity</p>
                  <p className="text-white text-sm font-medium">{Math.round(dayData.humidity)}%</p>
                </div>
              )}
              {dayData.wind_speed !== null && (
                <div className="text-center">
                  <p className="text-white/70 text-xs">Wind</p>
                  <p className="text-white text-sm font-medium">{dayData.wind_speed.toFixed(1)} m/s</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-white/70 text-xs">Status</p>
                <p className="text-white text-sm font-medium">Saved</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-white/70 text-xs">
          All weather data has been saved to the database
        </p>
      </div>
    </div>
  );
};

export default DateRangeResults;
