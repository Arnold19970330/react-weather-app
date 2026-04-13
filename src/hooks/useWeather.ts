import { useState, useCallback } from 'react';
import type { WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=no`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err) {
      setError('Nem sikerült lekérni az időjárást.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather };
};