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

  const temp =
    unit === "c"
      ? weather.current.temp_c
      : Math.round(weather.current.temp_c * 1.8 + 32);
  const feelsLike =
    unit === "c"
      ? weather.current.feelslike_c
      : Math.round(weather.current.feelslike_c * 1.8 + 32);

  const isRaining =
    weather.current.condition.text.toLowerCase().includes("rain") ||
    weather.current.condition.text.toLowerCase().includes("thunder");

  return (
    // CurrentWeatherCard.tsx (frissített verzió)
    <div
      className="group relative bg-slate-950/45 backdrop-blur-3xl border border-cyan-400/20 
             hover:border-emerald-400/40 rounded-3xl p-10 transition-all duration-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Finom belső glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/12 via-transparent to-emerald-500/10 rounded-3xl pointer-events-none" />

      {/* Tartalom */}
      <div className="relative z-10">
        <h2 className="text-3xl font-semibold text-cyan-100">
          {weather.location.name}
        </h2>
        <p className="text-emerald-300 text-sm mt-1">
          {weather.location.country}
        </p>

        <div className="mt-10">
          <span className="text-7xl font-light text-cyan-50">{temp}</span>
          <span className="text-5xl text-emerald-300">
            °{unit.toUpperCase()}
          </span>
        </div>

        <p className="text-2xl text-cyan-100/85 mt-2">
          {weather.current.condition.text}
        </p>
      </div>
    </div>
  );
}
