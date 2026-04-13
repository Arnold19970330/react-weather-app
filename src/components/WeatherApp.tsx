// src/components/weather/WeatherApp.tsx
"use client";

import { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import BackgroundEffects from './BackgroundEffects';
import SearchBar from './SearchBar';
import CurrentWeatherCard from './CurrentWeatherCard';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import DetailPanel from './DetailPanel';

export default function WeatherApp() {
  const { coords, error: geoError } = useGeolocation();
  const [unit, setUnit] = useState<'c' | 'f'>('c');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const { weather, loading, error: weatherError, fetchWeather } = useWeather();

  // Geolokáció alapján automatikus lekérés (csak egyszer, ha nincs manuális keresés)
  useEffect(() => {
    if (coords && !selectedLocation) {
      const query = `${coords.lat},${coords.lon}`;
      fetchWeather(query);
    }
  }, [coords, selectedLocation, fetchWeather]);

  const handleSearch = (query: string) => {
    setSelectedLocation(query);
    fetchWeather(query);
  };

  const error = geoError || weatherError;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05080b] text-slate-100">
      {/* Zöld → Fekete gradiens háttér (ahogy kérted) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#07111d] via-[#030507] to-[#02100d] z-0" />

      <BackgroundEffects weather={weather} />

      <div className="relative z-20 container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-cyan-200 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
            Weather
          </h1>

          <button
            onClick={() => setUnit(unit === 'c' ? 'f' : 'c')}
            className="px-6 py-2.5 bg-slate-950/45 backdrop-blur-xl hover:bg-slate-900/60 border border-cyan-400/30 rounded-2xl text-lg font-medium text-cyan-200 transition-all active:scale-95"
          >
            °{unit.toUpperCase()}
          </button>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="mt-6 p-4 bg-red-900/35 backdrop-blur-xl border border-red-500/35 rounded-2xl text-red-300 text-center">
            {error}
          </div>
        )}

        <div className="mt-12">
          {/* Bal oldal - Fő kártya + Részletek */}
          <div className="lg:col-span-5 space-y-8">
            <CurrentWeatherCard weather={weather} unit={unit} />
            <DetailPanel weather={weather} />
          </div>

          {/* Jobb oldal - Előrejelzések */}
          <div className="lg:col-span-7 space-y-8">
            <HourlyForecast hourly={weather?.hourly || []} unit={unit} />
            <DailyForecast daily={weather?.daily || []} unit={unit} />
          </div>
        </div>
      </div>
    </div>
  );
}