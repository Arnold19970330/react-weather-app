// src/components/weather/CurrentWeatherCard.tsx
"use client";

import { useState } from "react";
import type { WeatherData } from "../types/weather";
import { convertTemp } from "../utils/weatherHelpers";

interface CurrentWeatherCardProps {
  weather: WeatherData | null;
  unit: "c" | "f";
}

export default function CurrentWeatherCard({
  weather,
  unit,
}: CurrentWeatherCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!weather) {
    return (
      <div className="bg-slate-950/50 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-10 text-center h-[420px] flex items-center justify-center">
        <p className="text-cyan-100/70 text-xl">Betöltés...</p>
      </div>
    );
  }

  const temp = convertTemp(weather.current.temp_c, unit);
  const feelsLike = convertTemp(weather.current.feelslike_c, unit);
  const dewPoint = convertTemp(weather.current.dewpoint_c, unit);
  const conditionIcon = weather.current.condition.icon.startsWith("http")
    ? weather.current.condition.icon
    : `https:${weather.current.condition.icon}`;

  const isRaining =
    weather.current.condition.text.toLowerCase().includes("rain") ||
    weather.current.condition.text.toLowerCase().includes("thunder");

  return (
    <div
      className={`group relative bg-slate-950/45 backdrop-blur-3xl border rounded-3xl p-8 transition-all duration-500
      ${isRaining ? "border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border-cyan-400/20"}
      hover:border-emerald-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-cyan-100">{weather.location.name}</h2>
            <p className="text-emerald-300 text-sm mt-1">
              {weather.location.region}, {weather.location.country}
            </p>
            <p className="text-cyan-100/55 text-xs mt-1">
              Helyi idő: {weather.location.localtime}
            </p>
          </div>
          <img src={conditionIcon} alt={weather.current.condition.text} className="w-16 h-16 drop-shadow-md" />
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-light text-cyan-50">{temp}°</span>
            <div className="flex flex-col mb-2">
              <span className="text-emerald-300 text-xl tracking-widest uppercase">{unit}</span>
              <span className="text-cyan-100/50 text-sm whitespace-nowrap">Érzet: {feelsLike}°</span>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full border border-cyan-300/20 text-cyan-100/70 bg-cyan-500/5">
            {weather.current.is_day ? "Nappal" : "Éjszaka"}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <p className="text-2xl text-cyan-100/85">{weather.current.condition.text}</p>
          {isRaining && <span className="animate-bounce">💧</span>}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-900/45 border border-cyan-300/10 px-3 py-2">
            <p className="text-cyan-100/55 text-xs">Szél</p>
            <p className="text-emerald-300">{Math.round(weather.current.wind_kph)} km/h</p>
          </div>
          <div className="rounded-xl bg-slate-900/45 border border-cyan-300/10 px-3 py-2">
            <p className="text-cyan-100/55 text-xs">Széllökés</p>
            <p className="text-emerald-300">{Math.round(weather.current.gust_kph)} km/h</p>
          </div>
          <div className="rounded-xl bg-slate-900/45 border border-cyan-300/10 px-3 py-2">
            <p className="text-cyan-100/55 text-xs">Páratartalom</p>
            <p className="text-emerald-300">{weather.current.humidity}%</p>
          </div>
          <div className="rounded-xl bg-slate-900/45 border border-cyan-300/10 px-3 py-2">
            <p className="text-cyan-100/55 text-xs">Harmatpont</p>
            <p className="text-emerald-300">{dewPoint}°</p>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-5 pt-4 border-t border-cyan-300/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <p className="text-cyan-100/70">Csapadék: <span className="text-emerald-300">{weather.current.precip_mm} mm</span></p>
            <p className="text-cyan-100/70">Felhőzet: <span className="text-emerald-300">{weather.current.cloud}%</span></p>
            <p className="text-cyan-100/70">UV: <span className="text-emerald-300">{weather.current.uv}</span></p>
            <p className="text-cyan-100/70">Szélirány: <span className="text-emerald-300">{weather.current.wind_dir}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
