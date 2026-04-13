// src/components/weather/DailyForecast.tsx
"use client";

import type { WeatherData } from '../types/weather';
import { convertTemp } from '../utils/weatherHelpers';

interface DailyForecastProps {
  daily: WeatherData['daily'];
  unit: 'c' | 'f';
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  if (!daily || daily.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-950/45 backdrop-blur-3xl border border-cyan-400/20 rounded-3xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <h3 className="text-xl font-semibold text-cyan-100 mb-6 flex items-center gap-2">
        7 napos előrejelzés
      </h3>

      <div className="space-y-3">
        {daily.map((day, index) => {
          const maxTemp = convertTemp(day.max_temp_c, unit);
          const minTemp = convertTemp(day.min_temp_c, unit);
          const isToday = index === 0;

          return (
            <div
              key={index}
              className={`
                group flex items-center justify-between px-6 py-4 
                bg-slate-900/35 hover:bg-slate-800/45 border border-cyan-300/10 
                hover:border-cyan-300/35 rounded-2xl transition-all duration-300 backdrop-blur-xl
                ${isToday ? 'ring-1 ring-cyan-400/35 bg-slate-800/40' : ''}
              `}
            >
              {/* Nap neve */}
              <div className="w-28">
                <p className="font-medium text-lg text-cyan-100">
                  {isToday ? "Ma" : day.date}
                </p>
              </div>

              {/* Időjárás ikon + leírás */}
              <div className="flex items-center gap-4 flex-1">
                <img 
                  src={day.icon} 
                  alt={day.condition}
                  className="w-10 h-10 drop-shadow-md"
                />
                <p className="text-cyan-100/80 text-sm line-clamp-1">
                  {day.condition}
                </p>
              </div>

              {/* Hőmérséklet tartomány */}
              <div className="flex items-center gap-4 min-w-[110px] justify-end">
                <span className="text-xl font-light text-emerald-300">
                  {maxTemp}°
                </span>
                <span className="text-lg font-light text-cyan-100/55">
                  {minTemp}°
                </span>
              </div>

              {/* Kis nyíl hoverkor */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-200/35 text-xl">
                →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}