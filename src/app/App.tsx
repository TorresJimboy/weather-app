import { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge, CloudRain, Sun, Cloud } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import backgroundImage from '../assets/natureset.jpg'

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  icon: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = 'a519ad90c07dc929782844a3ebfe9662';
  const defaultCity = 'Manila';

  useEffect(() => {
    // Load Manila weather on initial mount
    fetchWeather(defaultCity);
  }, []);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    try {
      // Current Weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      if (!weatherRes.ok) throw new Error('City not found');
      const weatherJson = await weatherRes.json();

      const mappedWeather: WeatherData = {
        city: weatherJson.name,
        country: weatherJson.sys.country,
        temp: Math.round(weatherJson.main.temp),
        condition: weatherJson.weather[0].main,
        description: weatherJson.weather[0].description,
        humidity: weatherJson.main.humidity,
        windSpeed: Math.round(weatherJson.wind.speed * 3.6), // m/s → km/h
        visibility: Math.round(weatherJson.visibility / 1000), // m → km
        pressure: weatherJson.main.pressure,
        feelsLike: Math.round(weatherJson.main.feels_like),
        icon: weatherJson.weather[0].main.toLowerCase(),
      };
      setCurrentWeather(mappedWeather);

      // 5-Day Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      const forecastJson = await forecastRes.json();

      const dailyForecast: ForecastDay[] = [];
      const daysAdded = new Set<string>();
      for (const item of forecastJson.list) {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const hour = date.getHours();

        if (hour === 12 && !daysAdded.has(day)) {
          daysAdded.add(day);
          dailyForecast.push({
            day,
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: item.weather[0].main.toLowerCase(),
          });
        }
        if (dailyForecast.length === 5) break;
      }

      setForecast(dailyForecast);
    } catch (err: any) {
      alert(err.message || 'Error fetching weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    fetchWeather(searchTerm.trim());
    setSearchTerm('');
  };

  const getMainWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'clear':
        return <Sun className="w-32 h-32 text-yellow-300" />;
      case 'clouds':
        return <Cloud className="w-32 h-32 text-gray-200" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-32 h-32 text-blue-300" />;
      default:
        return <Sun className="w-32 h-32 text-yellow-300" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background & Overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">SkyVision</h1>
          <p className="text-white/80 text-lg">Your Window to the Sky</p>
        </header>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="backdrop-blur-md bg-white/20 rounded-full p-2 shadow-xl border border-white/30 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white/70 ml-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a location to see its sky..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/60 px-4 py-3"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white/30 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </form>

        {/* Current Weather */}
        {currentWeather && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="backdrop-blur-lg bg-white/20 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <MapPin className="w-6 h-6 text-white/80" />
                    <h2 className="text-3xl font-semibold text-white">
                      {currentWeather.city}, {currentWeather.country}
                    </h2>
                  </div>
                  <div className="mb-6">
                    <div className="text-7xl md:text-8xl font-bold text-white mb-2">
                      {currentWeather.temp}°
                    </div>
                    <p className="text-2xl text-white/90">{currentWeather.condition}</p>
                    <p className="text-lg text-white/70 mt-2">{currentWeather.description}</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                    <span>Feels like {currentWeather.feelsLike}°</span>
                  </div>
                </div>
                <div className="flex-shrink-0">{getMainWeatherIcon(currentWeather.icon)}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/20">
                <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-1">Humidity</p>
                  <p className="text-white text-xl font-semibold">{currentWeather.humidity}%</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 text-center">
                  <Wind className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-1">Wind Speed</p>
                  <p className="text-white text-xl font-semibold">{currentWeather.windSpeed} km/h</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 text-center">
                  <Eye className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-1">Visibility</p>
                  <p className="text-white text-xl font-semibold">{currentWeather.visibility} km</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 text-center">
                  <Gauge className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-1">Pressure</p>
                  <p className="text-white text-xl font-semibold">{currentWeather.pressure} mb</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <h3 className="text-3xl font-bold text-white mb-6 text-center md:text-left">
              5-Day Forecast
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <WeatherCard
                  key={index}
                  day={day.day}
                  temp={day.temp}
                  condition={day.condition}
                  icon={day.icon}
                />
              ))}
            </div>
          </div>
        )}

        <footer className="text-center text-white/70 pt-8 border-t border-white/20">
          <p className="mb-2">SkyVision • Real-time Weather Insights</p>
          <p className="text-sm">Powered by OpenWeatherMap API</p>
        </footer>
      </div>
    </div>
  );
}