// src/components/weather/WeatherSkeleton.tsx
"use client";

export default function WeatherSkeleton() {
  return (
    <div className="bg-slate-950/45 backdrop-blur-3xl border border-cyan-400/20 p-8 rounded-3xl shadow-2xl max-w-xl w-full mx-auto">
      {/* Cím placeholder */}
      <div className="flex justify-center mb-6">
        <div className="h-9 w-48 bg-gray-300/70 rounded-2xl animate-pulse" />
      </div>

      {/* Ikon placeholder */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-300/60 rounded-full animate-pulse" />
      </div>

      {/* Város és idő */}
      <div className="space-y-3 text-center mb-8">
        <div className="h-8 w-64 mx-auto bg-gray-300/70 rounded-xl animate-pulse" />
        <div className="h-5 w-40 mx-auto bg-gray-300/50 rounded-lg animate-pulse" />
      </div>

      {/* Hőmérséklet */}
      <div className="flex justify-center mb-8">
        <div className="h-20 w-32 bg-gray-300/70 rounded-2xl animate-pulse" />
      </div>

      {/* Feltétel szöveg */}
      <div className="h-6 w-52 mx-auto bg-gray-300/60 rounded-xl animate-pulse mb-10" />

      {/* Részletek grid */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gray-300/50 rounded-xl animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 bg-gray-300/60 rounded animate-pulse" />
              <div className="h-5 w-16 bg-gray-300/70 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}