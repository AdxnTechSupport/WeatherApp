import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = ({ weatherData, isDay }) => {
  if (!weatherData || !weatherData.coord) return null;

  const { coord, name, weather, main } = weatherData;
  const position = [coord.lat, coord.lon];

  const gradientClass = isDay
    ? 'bg-blue-500/30'
    : 'bg-indigo-800/30';

  return (
    <div className={`${gradientClass} backdrop-blur-sm rounded-2xl p-5 mb-4 transition-colors duration-500`}>
      <h3 className="text-white font-semibold mb-3 text-lg">Weather Map</h3>
      <div className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-sm" style={{ height: '300px' }}>
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Weather overlay from OpenWeatherMap */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo'}`}
            attribution='Weather from OpenWeatherMap'
            opacity={0.5}
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <strong>{name}</strong><br />
                {weather[0].main}<br />
                {Math.round(main.temp)}°C
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="text-white/70 text-xs mt-2 text-center">
        Interactive map showing location and temperature overlay
      </div>
    </div>
  );
};

export default WeatherMap;
