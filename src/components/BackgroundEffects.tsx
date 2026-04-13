"use client";

import { useMemo } from 'react';
import type { WeatherData } from '../types/weather';

interface BackgroundEffectsProps {
  weather: WeatherData | null;
}

export default function BackgroundEffects({ weather }: BackgroundEffectsProps) {
  
  // ←←← EBBEN A useMemo-ban van a régi getBackgroundStyle() logikája
  const backgroundClass = useMemo(() => {
    if (!weather) {
      return "from-gray-700 via-gray-900 to-black";
    }

    const text = weather.current.condition.text.toLowerCase();

    // 1. Eső / Vihar / Szemerkélés
    if (
      text.includes("rain") ||
      text.includes("thunder") ||
      text.includes("drizzle") ||
      text.includes("showers")
    ) {
      return "from-blue-900 via-gray-700 to-gray-900";
    }

    // 2. Hó / Fagy / Jégeső
    if (
      text.includes("snow") ||
      text.includes("sleet") ||
      text.includes("ice")
    ) {
      return "from-blue-100 via-blue-300 to-white";
    }

    // 3. Napos / Tiszta
    if (
      text.includes("sun") ||
      text.includes("clear")
    ) {
      return "from-yellow-300 via-orange-400 to-red-500";
    }

    // 4. Felhős / Ködös / Párás
    if (
      text.includes("cloud") ||
      text.includes("mist") ||
      text.includes("fog") ||
      text.includes("overcast")
    ) {
      return "from-gray-400 via-gray-600 to-gray-800";
    }

    // 5. Alapértelmezett (ha valami nem illeszkedik)
    return "from-green-300 via-blue-400 to-purple-600";
  }, [weather]);

  // A háttér ikonok és animációk (a régi getBackgroundIcons logikája)
  const backgroundIcons = useMemo(() => {
    // ... (itt marad a teljes eső, hó, nap, felhő, köd stb. kódod, amit korábban megadtam)

    if (!weather) {
      return (
        <>
          <span className="absolute top-10 left-1/4 text-9xl opacity-10 animate-pulse">☁️</span>
          <span className="absolute bottom-20 right-1/4 text-8xl opacity-10 animate-pulse">💨</span>
        </>
      );
    }

    const text = weather.current.condition.text.toLowerCase();

    // NAPOS
    if (text.includes("sun") || text.includes("clear")) {
      return <span className="absolute top-20 left-1/3 text-9xl opacity-60 animate-bounce">☀️</span>;
    }

    // ESŐ / VIHAR
    if (text.includes("rain") || text.includes("drizzle") || text.includes("thunder") || text.includes("showers")) {
      const rainClouds = [
        { top: "0%", left: "10%", size: "320px" },
        { top: "8%", left: "55%", size: "260px" },
      ];
      const rainSpawnZones = [
        { minLeft: 12, maxLeft: 34, minTop: 18, maxTop: 30 },
        { minLeft: 57, maxLeft: 79, minTop: 20, maxTop: 32 },
      ];
      const rainPositions = generateRandomPositions(45, rainSpawnZones, 1.4, 2.8);

      return (
        <>
          {rainPositions.map((pos, idx) => (
            <span
              key={`rain-${idx}`}
              className="absolute text-4xl opacity-75 rain-drop z-10"
              style={{ left: pos.left, top: pos.top, animationDuration: pos.duration, animationDelay: pos.delay }}
            >
              💧
            </span>
          ))}
          {/* Felhők az esőhöz */}
          {rainClouds.map((cloud, idx) => (
            <span
              key={`cloud-rain-${idx}`}
              className="absolute opacity-50 z-20"
              style={{ top: cloud.top, left: cloud.left, fontSize: cloud.size }}
            >
              ☁️
            </span>
          ))}
          {text.includes("thunder") && (
            <span className="absolute top-1/3 left-1/2 text-[220px] opacity-90 animate-pulse z-30">⚡</span>
          )}
        </>
      );
    }

    // HÓ (itt is használhatod a korábbi snowPositions tömbödet)
    if (text.includes("snow") || text.includes("sleet") || text.includes("ice")) {
      // ... ugyanaz a hó logika, mint korábban
      const snowClouds = [
        { top: "-4%", left: "10%", size: "280px" },
        { top: "6%", left: "65%", size: "250px" },
      ];
      const snowSpawnZones = [
        { minLeft: 12, maxLeft: 34, minTop: 16, maxTop: 28 },
        { minLeft: 67, maxLeft: 87, minTop: 18, maxTop: 30 },
      ];
      const snowPositions = generateRandomPositions(30, snowSpawnZones, 2.5, 4.5);

      return (
        <>
          {snowPositions.map((pos, idx) => (
            <span
              key={`snow-${idx}`}
              className="absolute text-4xl opacity-80 snow-flake z-10"
              style={{ left: pos.left, top: pos.top, animationDuration: pos.duration, animationDelay: pos.delay }}
            >
              ❄️
            </span>
          ))}
          {/* Felhők hóhoz */}
          {snowClouds.map((cloud, idx) => (
            <span
              key={`cloud-snow-${idx}`}
              className="absolute opacity-55 z-20"
              style={{ top: cloud.top, left: cloud.left, fontSize: cloud.size }}
            >
              ☁️
            </span>
          ))}
        </>
      );
    }

    // FELHŐS / KÖD stb. – ugyanígy folytathatod a régi kódoddal

    return <span className="absolute top-1/2 left-1/2 text-9xl opacity-10 animate-spin">🌀</span>;
  }, [weather]);

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${backgroundClass} transition-all duration-1000`}>
      {backgroundIcons}
    </div>
  );
}

// Segédfüggvény (maradhat itt, vagy tedd utils/weatherHelpers.ts-be)
const generateRandomPositions = (
  numberOfDrops: number,
  zones: { minLeft: number; maxLeft: number; minTop: number; maxTop: number }[],
  minDuration: number,
  maxDuration: number
) => {
  const positions: Array<{ left: string; top: string; delay: string; duration: string }> = [];
  for (let i = 0; i < numberOfDrops; i++) {
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const randomLeft = Math.floor(Math.random() * (randomZone.maxLeft - randomZone.minLeft + 1)) + randomZone.minLeft;
    const randomTop = Math.floor(Math.random() * (randomZone.maxTop - randomZone.minTop + 1)) + randomZone.minTop;

    positions.push({
      left: `${randomLeft}%`,
      top: `${randomTop}%`,
      delay: (Math.random() * 2).toFixed(1) + "s",
      duration: (Math.random() * (maxDuration - minDuration) + minDuration).toFixed(1) + "s",
    });
  }
  return positions;
};