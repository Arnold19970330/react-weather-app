export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  is_day: number;
  condition: { text: string; icon: string; code: number };
  humidity: number;
  wind_kph: number;
  wind_mph: number;
  wind_dir: string;
  gust_kph: number;
  precip_mm: number;
  cloud: number;
  uv: number;
  pressure_mb: number;
  vis_km: number;
  dewpoint_c: number;
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
  chance_of_rain: number;
  max_wind_kph: number;
  avg_humidity: number;
  uv: number;
}

export interface WeatherData {
  location: { name: string; region: string; country: string; localtime: string };
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
  sunrise: string;
  sunset: string;
}

export interface WeatherSearchSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}