const WeatherAlerts = ({ alerts, isDay }) => {
  if (!alerts || alerts.length === 0) return null;

  const bgClass = isDay
    ? 'bg-orange-500/20 border-orange-300/30'
    : 'bg-orange-500/30 border-orange-400/40';

  return (
    <div className={`${bgClass} backdrop-blur-sm border text-white px-5 py-4 rounded-2xl mb-4 transition-colors duration-500`}>
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Weather Alerts</h3>
          {alerts.map((alert, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <p className="font-medium text-sm">{alert.event}</p>
              <p className="text-xs opacity-90 mt-1">{alert.headline}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(alert.effective).toLocaleString()} - {new Date(alert.expires).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;
