// src/components/weather/HourlyForecast.tsx
"use client";

import type { WeatherData } from '../types/weather';
import { convertTemp } from '../utils/weatherHelpers';

interface HourlyForecastProps {
  hourly: WeatherData['hourly'];   // vagy HourlyData[] ha külön típusod van
  unit: 'c' | 'f';
}

export default function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  if (!hourly || hourly.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-950/45 backdrop-blur-3xl border border-cyan-400/20 rounded-3xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <h3 className="text-xl font-semibold text-cyan-100 mb-6 flex items-center gap-2">
        Óránkénti előrejelzés
        <span className="text-sm font-normal text-emerald-300/80">24 óra</span>
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {hourly.map((hour, index) => {
          const temp = convertTemp(hour.temp_c, unit);
          const isNow = index === 0;

          return (
            <div
              key={index}
              className={`
                flex-shrink-0 w-24 bg-slate-900/35 hover:bg-slate-800/45 border border-cyan-300/10 
                hover:border-cyan-300/40 rounded-2xl p-4 text-center transition-all duration-300 backdrop-blur-xl
                snap-start ${isNow ? 'ring-2 ring-cyan-400/50 scale-105' : ''}
              `}
            >
              <p className="text-sm text-cyan-100/75 mb-3">
                {isNow ? 'Most' : hour.time}
              </p>

              <img
                src={hour.icon}
                alt={hour.condition}
                className="w-12 h-12 mx-auto mb-3 drop-shadow-md"
              />

              <p className="text-2xl font-light text-emerald-300 mb-1">
                {temp}°
              </p>

              <p className="text-xs text-cyan-100/60 line-clamp-2 h-10">
                {hour.condition}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}