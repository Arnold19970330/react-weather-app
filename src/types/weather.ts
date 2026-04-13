export interface CurrentWeather {
  temp_c: number;
  feelslike_c: number;
  condition: { text: string; icon: string };
  humidity: number;
  wind_kph: number;
  uv: number;
  pressure_mb: number;
  visibility_km: number;
}

export interface HourlyData {
  time: string;
  temp_c: number;
  condition: string;
  icon: string;
}

export interface DailyData {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  location: { name: string; country: string; localtime: string };
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
  sunrise: string;
  sunset: string;
}