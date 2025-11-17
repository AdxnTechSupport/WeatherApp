const WeatherDetails = ({ data, isDay }) => {
  if (!data) return null;

  const { main, wind, clouds, visibility } = data;

  const gradientClass = isDay
    ? 'bg-blue-500/30'
    : 'bg-indigo-800/30';

  const details = [
    { label: 'Feels Like', value: `${Math.round(main.feels_like)}°C` },
    { label: 'Humidity', value: `${main.humidity}%` },
    { label: 'Wind Speed', value: `${wind.speed.toFixed(1)} m/s` },
    { label: 'Pressure', value: `${main.pressure} hPa` },
    { label: 'Cloudiness', value: `${clouds.all}%` },
    { label: 'Visibility', value: `${(visibility / 1000).toFixed(1)} km` },
  ];

  return (
    <div className={`${gradientClass} backdrop-blur-sm rounded-2xl p-5 mb-4 transition-colors duration-500`}>
      <h3 className="text-white font-semibold mb-3 text-lg">Weather Details</h3>
      <div className="grid grid-cols-2 gap-3">
        {details.map((detail, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-white/70 text-xs mb-1">{detail.label}</p>
            <p className="text-white font-semibold text-lg">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
