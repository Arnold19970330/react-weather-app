import { useState, useCallback } from 'react';
import type { WeatherData } from '../types/weather';

const toDayLabel = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("hu-HU", { weekday: "short" });
};

const toHourLabel = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });
};

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchWeather = useCallback(async (query: string) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=no&alerts=no`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();

      const normalized: WeatherData = {
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          localtime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          feelslike_c: data.current.feelslike_c,
          feelslike_f: data.current.feelslike_f,
          is_day: data.current.is_day,
          condition: {
            text: data.current.condition.text,
            icon: data.current.condition.icon,
            code: data.current.condition.code,
          },
          humidity: data.current.humidity,
          wind_kph: data.current.wind_kph,
          wind_mph: data.current.wind_mph,
          wind_dir: data.current.wind_dir,
          gust_kph: data.current.gust_kph,
          precip_mm: data.current.precip_mm,
          cloud: data.current.cloud,
          uv: data.current.uv,
          pressure_mb: data.current.pressure_mb,
          vis_km: data.current.vis_km,
          dewpoint_c: data.current.dewpoint_c,
        },
        hourly: (data.forecast?.forecastday?.[0]?.hour ?? [])
          .filter((hour: { time_epoch: number }) => hour.time_epoch * 1000 >= Date.now())
          .slice(0, 24)
          .map((hour: { time: string; temp_c: number; condition: { text: string; icon: string } }) => ({
            time: toHourLabel(hour.time),
            temp_c: hour.temp_c,
            condition: hour.condition.text,
            icon: hour.condition.icon.startsWith("http") ? hour.condition.icon : `https:${hour.condition.icon}`,
          })),
        daily: (data.forecast?.forecastday ?? []).map(
          (day: {
            date: string;
            day: {
              maxtemp_c: number;
              mintemp_c: number;
              condition: { text: string; icon: string };
              daily_chance_of_rain: number;
              maxwind_kph: number;
              avghumidity: number;
              uv: number;
            };
          }) => ({
            date: toDayLabel(day.date),
            max_temp_c: day.day.maxtemp_c,
            min_temp_c: day.day.mintemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon.startsWith("http") ? day.day.condition.icon : `https:${day.day.condition.icon}`,
            chance_of_rain: day.day.daily_chance_of_rain,
            max_wind_kph: day.day.maxwind_kph,
            avg_humidity: day.day.avghumidity,
            uv: day.day.uv,
          })
        ),
        sunrise: data.forecast?.forecastday?.[0]?.astro?.sunrise ?? "-",
        sunset: data.forecast?.forecastday?.[0]?.astro?.sunset ?? "-",
      };

      setWeather(normalized);
    } catch {
      setError('Nem sikerült lekérni az időjárást.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather };
};