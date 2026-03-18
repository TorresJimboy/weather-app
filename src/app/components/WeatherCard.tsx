import { Cloud, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

interface WeatherCardProps {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export function WeatherCard({ day, temp, condition, icon }: WeatherCardProps) {
  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-300" />;
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case 'snowy':
        return <CloudSnow className="w-12 h-12 text-blue-200" />;
      default:
        return <Sun className="w-12 h-12 text-yellow-400" />;
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
      <h3 className="text-lg font-semibold text-white mb-4">{day}</h3>
      <div className="flex flex-col items-center gap-4">
        {getWeatherIcon(icon)}
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{temp}°</p>
          <p className="text-sm text-white/80 mt-1">{condition}</p>
        </div>
      </div>
    </div>
  );
}
