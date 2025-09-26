"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(city = "Budapest") {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&q=${city}&aqi=no`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError("Nem sikerült lekérni az időjárást.");
    }
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  // Gradiens háttér kiválasztása
  // Gradiens háttér kiválasztása
  function getBackgroundStyle() {
    if (!weather) return "from-gray-700 via-gray-900 to-black";

    const text = weather.current.condition.text.toLowerCase();

    // 1. Eső/Vihar
    if (
      text.includes("rain") ||
      text.includes("thunder") ||
      text.includes("drizzle")
    )
      return "from-blue-900 via-gray-700 to-gray-900"; // esős

    // 2. Hó/Fagy
    if (text.includes("snow") || text.includes("sleet") || text.includes("ice"))
      return "from-blue-100 via-blue-300 to-white"; // havas

    // 3. Napos/Tiszta
    if (text.includes("sun") || text.includes("clear"))
      return "from-yellow-300 via-orange-400 to-red-500"; // napos

    // 4. Felhős/Ködös/Párás (itt a maradék 'cloudy', 'mist', 'fog' esik be)
    if (text.includes("cloud") || text.includes("mist") || text.includes("fog"))
      return "from-gray-400 via-gray-600 to-gray-800"; // felhős/ködös

    // 5. Default (ha semmi nem illeszkedik, pl. "Patches of light rain and snow")
    return "from-green-300 via-blue-400 to-purple-600";
  }

  // Háttér ikonok condition szerint
  // Háttér ikonok condition szerint
  function getBackgroundIcons(weather: WeatherData | null) {
    if (!weather) {
      return (
        <>
          {/* Diszkrét, alapértelmezett felhő és szél animáció (Betöltés) */}
          <span className="absolute top-10 left-1/4 text-9xl opacity-10 animate-pulse">
            ☁️
          </span>
          <span className="absolute bottom-20 right-1/4 text-8xl opacity-10 animate-pulse">
            💨
          </span>
          <span className="absolute bottom-10 left-1/3 text-6xl opacity-5 animate-pulse">
            ☁️
          </span>
        </>
      );
    }

    const text = weather.current.condition.text.toLowerCase();

    // 1. NAPOS / TISZTA
    if (text.includes("sun") || text.includes("clear")) {
      return (
        <>
          <span className="absolute top-20 left-1/3 text-9xl opacity-60 animate-bounce">
            ☀️
          </span>
        </>
      );
    }

    // 2. ESŐS / SZEMERKÉLŐ / VIHAROS
    // Hozzáadva: "drizzle", "showers", "thunder"
    if (
      text.includes("rain") ||
      text.includes("drizzle") ||
      text.includes("showers") ||
      text.includes("thunder")
    ) {
      return (
        <>
          <span className="absolute top-20 left-1/4 text-8xl opacity-40 animate-bounce">
            ☁️
          </span>
          <span className="absolute top-1/2 right-1/3 text-7xl opacity-30 animate-bounce">
            ☁️
          </span>
          {/* Villám és eső az intenzívebb hatásért */}
          {text.includes("thunder") && (
            <span className="absolute top-1/3 left-1/2 text-9xl opacity-80 animate-flash">
              ⚡
            </span>
          )}
          <span className="absolute bottom-16 left-1/3 text-5xl opacity-70 animate-pulse">
            💧
          </span>
          <span className="absolute bottom-28 right-1/3 text-5xl opacity-70 animate-pulse">
            💧
          </span>
        </>
      );
    }

    // 3. HAVAS / FAGYOS
    // Hozzáadva: "sleet", "ice"
    if (
      text.includes("snow") ||
      text.includes("sleet") ||
      text.includes("ice")
    ) {
      return (
        <>
          <span className="absolute top-10 left-20 text-6xl opacity-70 animate-bounce">
            ❄️
          </span>
          <span className="absolute top-14 left-24 text-6xl opacity-70 animate-bounce">
            ❄️
          </span>
          <span className="absolute top-20 left-40 text-6xl opacity-70 animate-bounce">
            ❄️
          </span>
          <span className="absolute top-8 left-24 text-6xl opacity-70 animate-bounce">
            ❄️
          </span>
          <span className="absolute top-40 right-20 text-7xl opacity-60 animate-bounce">
            ❄️
          </span>
          <span className="absolute bottom-20 left-1/3 text-8xl opacity-50 animate-bounce">
            ❄️
          </span>
          {text.includes("sleet") && (
            <span className="absolute top-1/2 left-1/2 text-5xl opacity-80 animate-pulse">
              🌨️
            </span>
          )}
        </>
      );
    }

    // 4. FELHŐS
    if (text.includes("cloud") || text.includes("overcast")) {
      return (
        <>
          <span className="absolute top-10 left-10 text-7xl opacity-50 animate-pulse">
            ☁️
          </span>
          <span className="absolute top-1/3 right-1/4 text-8xl opacity-40 animate-pulse">
            ☁️
          </span>
          <span className="absolute bottom-16 left-1/2 text-9xl opacity-30 animate-pulse">
            ☁️
          </span>
          <span className="absolute bottom-10 left-1/4 text-9xl opacity-30 animate-pulse">
            ☁️
          </span>
          <span className="absolute bottom-20 left-1/8 text-9xl opacity-30 animate-pulse">
            ☁️
          </span>
          <span className="absolute bottom-40 left-10 text-9xl opacity-30 animate-pulse">
            ☁️
          </span>
        </>
      );
    }

    // 5. KÖD / PÁRA / SEMLEGES ESET (MIST, FOG, HAZE)
    // Ez a kategória lefed minden olyan esetet, ami nem eső, hó, felhő vagy napos.
    if (
      text.includes("mist") ||
      text.includes("fog") ||
      text.includes("haze")
    ) {
      return (
        <>
          <span className="absolute top-1/4 left-1/4 text-9xl opacity-30 animate-pulse">
            🌫️
          </span>
          <span className="absolute bottom-1/4 right-1/4 text-8xl opacity-20 animate-pulse">
            🌫️
          </span>
        </>
      );
    }

    // 6. VÉGSŐ ALAPÉRTELMEZETT VISSZATÉRÉS (ha valami teljesen váratlan jön az API-ból)
    // Ide egy nagyon semleges vagy a felhőhöz hasonló ikon illik.
    return (
      <>
        <span className="absolute top-1/2 left-1/2 text-9xl opacity-10 animate-spin">
          🌀
        </span>
      </>
    );
  }

  return (
    <div
      className={`h-screen w-screen bg-gradient-to-br ${getBackgroundStyle()} flex items-center justify-center relative overflow-hidden`}
    >
      {getBackgroundIcons(weather)}
      {/* Központi kártya */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow max-w-xl w-full text-center mx-auto">
        <h1 className="text-3xl font-bold mb-4">🌦 Local Weather</h1>

        {error && <p className="text-red-700 font-semibold">{error}</p>}

        {weather ? (
          <>
            <img
              src={weather.current.condition.icon}
              alt="Weather icon"
              className="mx-auto"
            />

            <h2 className="text-2xl font-semibold mt-2">
              {weather.location.name}, {weather.location.country}
            </h2>
            <p className="text-gray-500">{weather.location.localtime}</p>

            <p className="text-4xl font-bold mt-2">
              {weather.current.temp_c}°C
            </p>
            <p className="italic">{weather.current.condition.text}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
              <p>🌡 Feels like: {weather.current.feelslike_c}°C</p>
              <p>💧 Humidity: {weather.current.humidity}%</p>
              <p>💨 Wind: {weather.current.wind_kph} kph</p>
              <p>🔆 UV index: {weather.current.uv}</p>
            </div>
          </>
        ) : (
          !error && <p className="text-gray-700">Betöltés...</p>
        )}
      </div>
    </div>
  );
}
