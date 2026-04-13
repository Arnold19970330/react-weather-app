// src/components/weather/DetailPanel.tsx
"use client";

import type { WeatherData } from '../types/weather';

interface DetailPanelProps {
  weather: WeatherData | null;
}

export default function DetailPanel({ weather }: DetailPanelProps) {
  if (!weather) return null;

  const current = weather.current;
  const isHighUV = current.uv >= 6;

  return (
    <div className="bg-slate-950/45 backdrop-blur-3xl border border-cyan-400/20 rounded-3xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <h3 className="text-xl font-semibold text-cyan-100 mb-6">Részletes adatok</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* UV Index */}
        <div className="bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">☀️</span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              isHighUV ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isHighUV ? 'MAGAS' : 'NORMÁL'}
            </span>
          </div>
          <p className="text-4xl font-light text-cyan-100">{current.uv}</p>
          <p className="text-sm text-cyan-200/75">UV index</p>
          <p className="text-xs text-cyan-100/55 mt-2">
            {current.uv >= 8 ? 'Kerüld a közvetlen napfényt!' : 
             current.uv >= 6 ? 'Használj napvédőt!' : 'Biztonságos'}
          </p>
        </div>

        {/* Napkelte / Napnyugta */}
        <div className="bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xl">🌅</p>
              <p className="font-medium mt-1 text-cyan-100">{weather.sunrise}</p>
              <p className="text-xs text-cyan-200/70">Napkelte</p>
            </div>
            <div className="flex-1 h-px bg-cyan-200/20 my-6" />
            <div className="text-right">
              <p className="text-xl">🌇</p>
              <p className="font-medium mt-1 text-cyan-100">{weather.sunset}</p>
              <p className="text-xs text-cyan-200/70">Napnyugta</p>
            </div>
          </div>
        </div>

        {/* Légnyomás */}
        <div className="bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors">
          <span className="text-3xl mb-3 block">📊</span>
          <p className="text-3xl font-light text-cyan-100">{current.pressure_mb}</p>
          <p className="text-sm text-cyan-200/75">hPa – Légnyomás</p>
          <p className="text-xs text-cyan-100/55 mt-2">
            {current.pressure_mb > 1015 ? 'Magas nyomás – derült idő várható' : 
             current.pressure_mb < 1005 ? 'Alacsony nyomás – eső valószínű' : 'Normál'}
          </p>
        </div>

        {/* Láthatóság */}
        <div className="bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors">
          <span className="text-3xl mb-3 block">👁️</span>
          <p className="text-3xl font-light text-cyan-100">{current.vis_km}</p>
          <p className="text-sm text-cyan-200/75">km – Láthatóság</p>
        </div>

        {/* Páratartalom + Szél */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors">
            <span className="text-3xl mb-3 block">💧</span>
            <p className="text-3xl font-light text-cyan-100">{current.humidity}%</p>
            <p className="text-sm text-cyan-200/75">Páratartalom</p>
          </div>

          <div className="bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors">
            <span className="text-3xl mb-3 block">💨</span>
            <p className="text-3xl font-light text-cyan-100">{current.wind_kph}</p>
            <p className="text-sm text-cyan-200/75">km/h – Szélsebesség</p>
          </div>
        </div>

        {/* Kiegészítő metrikák */}
        <div className="col-span-2 bg-slate-900/35 rounded-2xl p-5 hover:bg-slate-800/40 border border-cyan-300/10 transition-colors">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-2xl">🌧️</span>
              <p className="text-sm text-cyan-200/75 mt-2">Csapadék</p>
              <p className="text-xl text-emerald-300">{current.precip_mm} mm</p>
            </div>
            <div>
              <span className="text-2xl">☁️</span>
              <p className="text-sm text-cyan-200/75 mt-2">Felhőzet</p>
              <p className="text-xl text-emerald-300">{current.cloud}%</p>
            </div>
            <div>
              <span className="text-2xl">🧊</span>
              <p className="text-sm text-cyan-200/75 mt-2">Harmatpont</p>
              <p className="text-xl text-emerald-300">{Math.round(current.dewpoint_c)}°C</p>
            </div>
            <div>
              <span className="text-2xl">🧭</span>
              <p className="text-sm text-cyan-200/75 mt-2">Szélirány</p>
              <p className="text-xl text-emerald-300">{current.wind_dir}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}