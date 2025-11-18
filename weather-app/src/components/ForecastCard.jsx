import { getWeatherIconUrl } from '../utils/weatherApi';

const ForecastCard = ({ forecast, isDay }) => {
  if (!forecast || !forecast.daily || forecast.daily.length === 0) {
    return null;
  }

  // Different colors for day vs night
  const gradientClass = isDay
    ? 'bg-gradient-to-b from-blue-500/90 to-blue-600/90'
    : 'bg-gradient-to-b from-indigo-800/90 to-purple-800/90';

  return (
    <div className={`${gradientClass} backdrop-blur-sm rounded-3xl p-6 shadow-2xl text-white transition-colors duration-500`}>
      <div className="space-y-4">
        {forecast.daily.map((day, index) => {
          // Use dt_txt (date string) directly to avoid timezone issues
          const dateParts = day.dt_txt.split('-');
          const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));

          // Show "Today" for first item if it's today
          const today = new Date();
          const isToday = date.getDate() === today.getDate() &&
                         date.getMonth() === today.getMonth() &&
                         date.getFullYear() === today.getFullYear();

          const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
          const tempMin = Math.round(day.main.temp_min);
          const tempMax = Math.round(day.main.temp_max);
          const icon = day.weather[0].icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-white/20 last:border-0"
            >
              <div className="flex-1 text-left">
                <p className="text-lg font-medium">{dayName}</p>
              </div>

              <div className="flex items-center gap-6">
                <img
                  src={getWeatherIconUrl(icon, true)}
                  alt="weather icon"
                  className="w-12 h-12 drop-shadow-md"
                />

                <div className="flex gap-4 min-w-[80px] justify-end">
                  <span className="text-xl font-semibold">{tempMax}°</span>
                  <span className="text-xl opacity-50">{tempMin}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
