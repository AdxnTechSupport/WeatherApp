import { getWeatherIconUrl } from '../utils/weatherApi';

const CurrentWeather = ({ data, isDay }) => {
  if (!data) return null;

  const {
    name,
    main,
    weather,
    dt
  } = data;

  const weatherDescription = weather[0].main;
  const weatherIcon = weather[0].icon;
  const temperature = Math.round(main.temp);

  const date = new Date(dt * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Different gradient colors for day vs night
  const gradientClass = isDay
    ? 'bg-gradient-to-b from-blue-500 to-blue-600'
    : 'bg-gradient-to-b from-indigo-900 to-purple-900';

  return (
    <div className={`${gradientClass} rounded-3xl p-8 shadow-2xl text-white text-center mb-4 transition-colors duration-500`}>
      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      <p className="text-xl mb-6 capitalize opacity-90">{weatherDescription}</p>

      <div className="mb-6">
        <img
          src={getWeatherIconUrl(weatherIcon)}
          alt={weatherDescription}
          className="w-32 h-32 mx-auto drop-shadow-lg"
        />
      </div>

      <div className="text-8xl font-bold mb-4">{temperature}°</div>
      <p className="text-lg opacity-75">{formattedDate}</p>

      <div className="mt-4 text-sm opacity-60">
        {isDay ? 'Daytime' : 'Nighttime'}
      </div>
    </div>
  );
};

export default CurrentWeather;
