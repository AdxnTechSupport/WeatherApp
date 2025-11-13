const WeatherDetails = ({ data, isDay }) => {
  if (!data) return null;

  const { main, wind, clouds, visibility } = data;

  const gradientClass = isDay
    ? 'bg-blue-500/30'
    : 'bg-indigo-800/30';

  const details = [
    { label: 'Feels Like', value: `${Math.round(main.feels_like)}°C`, icon: '🌡️' },
    { label: 'Humidity', value: `${main.humidity}%`, icon: '💧' },
    { label: 'Wind Speed', value: `${wind.speed.toFixed(1)} m/s`, icon: '💨' },
    { label: 'Pressure', value: `${main.pressure} hPa`, icon: '🎚️' },
    { label: 'Cloudiness', value: `${clouds.all}%`, icon: '☁️' },
    { label: 'Visibility', value: `${(visibility / 1000).toFixed(1)} km`, icon: '👁️' },
  ];

  return (
    <div className={`${gradientClass} backdrop-blur-sm rounded-2xl p-5 mb-4 transition-colors duration-500`}>
      <h3 className="text-white font-semibold mb-3 text-lg">Weather Details</h3>
      <div className="grid grid-cols-2 gap-3">
        {details.map((detail, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{detail.icon}</span>
              <p className="text-white/70 text-xs">{detail.label}</p>
            </div>
            <p className="text-white font-semibold text-lg">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
