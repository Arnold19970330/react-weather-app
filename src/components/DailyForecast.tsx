// src/components/weather/DailyForecast.tsx
"use client";

import { useState } from 'react';
import type { WeatherData } from '../types/weather';
import { convertTemp } from '../utils/weatherHelpers';

interface DailyForecastProps {
  daily: WeatherData['daily'];
  unit: 'c' | 'f';
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  const [expandedDay, setExpandedDay] = useState<number>(0);

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
          const isExpanded = expandedDay === index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setExpandedDay((prev) => (prev === index ? -1 : index))}
              className={`
                w-full text-left group px-6 py-4
                bg-gradient-to-r from-slate-950/55 via-slate-900/40 to-slate-950/55
                hover:from-slate-900/60 hover:via-slate-800/45 hover:to-slate-900/60
                border border-cyan-300/10 hover:border-cyan-300/35
                rounded-2xl transition-all duration-300 backdrop-blur-xl
                ${isToday ? 'ring-1 ring-cyan-400/35 bg-slate-800/40' : ''}
                ${isExpanded ? 'border-cyan-300/45 shadow-[0_0_20px_rgba(34,211,238,0.12)]' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="w-28">
                  <p className="font-medium text-lg text-cyan-100">
                    {isToday ? "Ma" : day.date}
                  </p>
                </div>

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

                <div className="flex items-center gap-4 min-w-[110px] justify-end">
                  <span className="text-xl font-light text-emerald-300">
                    {maxTemp}°
                  </span>
                  <span className="text-lg font-light text-cyan-100/55">
                    {minTemp}°
                  </span>
                </div>

                <div
                  className={`text-cyan-200/55 text-lg ml-3 transition-transform duration-300 ${
                    isExpanded ? "rotate-90" : "rotate-0"
                  }`}
                >
                  ▶
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-cyan-300/15 animate-[fadeIn_.25s_ease-out]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-slate-950/60 border border-cyan-300/10 px-3 py-3">
                      <p className="text-cyan-100/55 text-xs flex items-center gap-1">🌧️ Eső esélye</p>
                      <p className="text-emerald-300 text-base mt-1">{day.chance_of_rain}%</p>
                    </div>
                    <div className="rounded-xl bg-slate-950/60 border border-cyan-300/10 px-3 py-3">
                      <p className="text-cyan-100/55 text-xs flex items-center gap-1">💨 Max szél</p>
                      <p className="text-emerald-300 text-base mt-1">{Math.round(day.max_wind_kph)} km/h</p>
                    </div>
                    <div className="rounded-xl bg-slate-950/60 border border-cyan-300/10 px-3 py-3">
                      <p className="text-cyan-100/55 text-xs flex items-center gap-1">💧 Átlag pára</p>
                      <p className="text-emerald-300 text-base mt-1">{Math.round(day.avg_humidity)}%</p>
                    </div>
                    <div className="rounded-xl bg-slate-950/60 border border-cyan-300/10 px-3 py-3">
                      <p className="text-cyan-100/55 text-xs flex items-center gap-1">☀️ UV index</p>
                      <p className="text-emerald-300 text-base mt-1">{day.uv}</p>
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}