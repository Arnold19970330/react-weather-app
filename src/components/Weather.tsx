"use client";

import { useEffect, useState } from "react";

// Véletlenszerű pozíciókat generál a megadott sávokban.
// @param numberOfDrops - Hány elemet generáljon.
// @param bands - Az X koordináta sávjai (pl. { minLeft: 10, maxLeft: 25 }).
// @param minDuration - Minimális animációs idő (másodperc).
// @param maxDuration - Maximális animációs idő (másodperc).

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
  const [loading, setLoading] = useState(true);

  async function fetchWeather(location: string | null) {
    try {
      setError(null);
      if (location) {
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&q=${location}&aqi=no`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      setError("Nem sikerült lekérni az időjárást.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // felhasználó helye
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          // Hiba történt a geolokáció során
          console.error("Geolocation error:", err);
          setError(
            "Nem sikerült meghatározni a helyet. Kérlek engedélyezd a helymeghatározást."
          );
          setLoading(false);
        }
      );
    } else {
      // A böngésző nem támogatja a geolokációt
      setError("A böngésződ nem támogatja a helymeghatározást.");
      setLoading(false);
    }
  }, []);

  const generateRandomPositions = (
    numberOfDrops: number,
    bands: { minLeft: number; maxLeft: number }[],
    minDuration: number,
    maxDuration: number
  ) => {
    const positions = [];

    for (let i = 0; i < numberOfDrops; i++) {
      // Véletlenszerű sáv kiválasztása
      const randomBand = bands[Math.floor(Math.random() * bands.length)];

      // Véletlenszerű 'left' érték generálása a sávban
      const randomLeftPercent =
        Math.floor(
          Math.random() * (randomBand.maxLeft - randomBand.minLeft + 1)
        ) + randomBand.minLeft;

      // Véletlenszerű 'delay' 0 és 2.0 másodperc között
      const randomDelay = (Math.random() * 2.0).toFixed(1) + "s";

      // Véletlenszerű 'duration' a megadott tartományban
      const randomDuration =
        (Math.random() * (maxDuration - minDuration) + minDuration).toFixed(1) +
        "s";

      positions.push({
        left: `left-[${randomLeftPercent}%]`,
        delay: randomDelay,
        duration: randomDuration,
      });
    }
    return positions;
  };

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
      // Nagy felhők
      const clouds = [
        { top: "top-0", left: "left-[10%]", size: "text-[300px]", delay: "0s" },
        { top: "top-20", left: "left-[60%]", size: "text-[250px]", delay: "0.5s",},
        { top: "top-5", left: "left-[35%]", size: "text-[280px]", delay: "1s" },
      ];

      // Esőcseppek pozíciói a felhők alatt - több csepp folyamatos esőhöz
      const rainBands = [
            { minLeft: 10, maxLeft: 25 }, 
            { minLeft: 60, maxLeft: 75 }, 
            { minLeft: 35, maxLeft: 50 }, 
        ];

        // *** DINAMIKUS ESŐ GENERÁLÁSA ***
        // 40 csepp generálása 1.5s és 2.5s közötti animációs idővel
        const rainPositions = generateRandomPositions(40, rainBands, 1.5, 2.5);

        console.log(rainPositions);

      return (
        <>
          {/* Esőcseppek animáció - felhőből lefelé esnek (alacsonyabb z-index, hogy a felhők mögött legyenek) */}
          {rainPositions.map((pos, idx) => (
            <span
              key={`rain-${idx}`}
              className={`absolute top-[250px] ${pos.left} text-4xl opacity-70 rain-drop z-0`}
              style={{
                animationDuration: pos.duration,
                animationDelay: pos.delay,
              }}
            >
              💧
            </span>
          ))}

          {/* Nagy felhők (magasabb z-index, hogy előrébb legyenek) */}
          {clouds.map((cloud, idx) => (
            <span
              key={`cloud-${idx}`}
              className={`absolute ${cloud.top} ${cloud.left} ${cloud.size} opacity-50 z-10`}
            >
              ☁️
            </span>
          ))}

          {/* Villám */}
          {text.includes("thunder") && (
            <span className="absolute top-1/3 left-1/2 text-[200px] opacity-80 animate-pulse z-20">
              ⚡
            </span>
          )}
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
      // Nagy felhők
      const clouds = [
        {
          top: "-top-20",
          left: "left-[10%]",
          size: "text-[200px]",
          delay: "0s",
        },
        {
          top: "top-10",
          left: "left-[70%]",
          size: "text-[250px]",
          delay: "0.5s",
        },
        { top: "top-8", left: "left-[35%]", size: "text-[160px]", delay: "1s" },
      ];

      // Hó pozíciók a felhők alatt - több hó folyamatos havazáshoz
      const snowPositions = [
        // Első felhő alatt
        { left: "left-[12%]", delay: "0s", duration: "3s" },
        { left: "left-[12%]", delay: "1.5s", duration: "3s" },
        { left: "left-[14%]", delay: "0.3s", duration: "3.5s" },
        { left: "left-[14%]", delay: "1.8s", duration: "3.5s" },
        { left: "left-[16%]", delay: "0.6s", duration: "3.2s" },
        { left: "left-[16%]", delay: "2.1s", duration: "3.2s" },
        { left: "left-[18%]", delay: "0.2s", duration: "3.8s" },
        { left: "left-[18%]", delay: "1.7s", duration: "3.8s" },
        { left: "left-[20%]", delay: "0.5s", duration: "3.3s" },
        { left: "left-[20%]", delay: "2s", duration: "3.3s" },
        { left: "left-[22%]", delay: "0.8s", duration: "3.6s" },
        { left: "left-[22%]", delay: "2.3s", duration: "3.6s" },
        // Második felhő alatt
        { left: "left-[62%]", delay: "0.4s", duration: "3.1s" },
        { left: "left-[62%]", delay: "1.9s", duration: "3.1s" },
        { left: "left-[64%]", delay: "0.7s", duration: "3.4s" },
        { left: "left-[64%]", delay: "2.2s", duration: "3.4s" },
        { left: "left-[66%]", delay: "0.1s", duration: "3.7s" },
        { left: "left-[66%]", delay: "1.6s", duration: "3.7s" },
        { left: "left-[68%]", delay: "0.9s", duration: "3.2s" },
        { left: "left-[68%]", delay: "2.4s", duration: "3.2s" },
        { left: "left-[70%]", delay: "0.5s", duration: "3.5s" },
        { left: "left-[70%]", delay: "2s", duration: "3.5s" },
        { left: "left-[72%]", delay: "0.2s", duration: "3.8s" },
        { left: "left-[72%]", delay: "1.7s", duration: "3.8s" },
        // Harmadik felhő alatt
        { left: "left-[37%]", delay: "0.6s", duration: "3.3s" },
        { left: "left-[37%]", delay: "2.1s", duration: "3.3s" },
        { left: "left-[39%]", delay: "0.3s", duration: "3.6s" },
        { left: "left-[39%]", delay: "1.8s", duration: "3.6s" },
        { left: "left-[41%]", delay: "0.8s", duration: "3.1s" },
        { left: "left-[41%]", delay: "2.3s", duration: "3.1s" },
        { left: "left-[43%]", delay: "0.1s", duration: "3.7s" },
        { left: "left-[43%]", delay: "1.6s", duration: "3.7s" },
        { left: "left-[45%]", delay: "0.4s", duration: "3.4s" },
        { left: "left-[45%]", delay: "1.9s", duration: "3.4s" },
        { left: "left-[47%]", delay: "0.7s", duration: "3.9s" },
        { left: "left-[47%]", delay: "2.2s", duration: "3.9s" },
      ];

      return (
        <>
          {/* Hó animáció - felhőből lefelé esik (alacsonyabb z-index, hogy a felhők mögött legyenek) */}
          {snowPositions.map((pos, idx) => (
            <span
              key={`snow-${idx}`}
              className={`absolute top-[250px] ${pos.left} text-4xl opacity-80 snow-flake z-0`}
              style={{
                animationDuration: pos.duration,
                animationDelay: pos.delay,
              }}
            >
              ❄️
            </span>
          ))}

          {/* Nagy felhők (magasabb z-index, hogy előrébb legyenek) */}
          {clouds.map((cloud, idx) => (
            <span
              key={`cloud-snow-${idx}`}
              className={`absolute ${cloud.top} ${cloud.left} ${cloud.size} opacity-50 z-10`}
            >
              ☁️
            </span>
          ))}

          {text.includes("sleet") && (
            <span className="absolute top-1/2 left-1/2 text-[150px] opacity-60 animate-pulse z-10">
              🌨️
            </span>
          )}
        </>
      );
    }

    // 4. FELHŐS
    if (text.includes("cloud") || text.includes("overcast")) {
      const clouds = [
        { top: "top-10", left: "left-[5%]", size: "text-[300px]" },
        { top: "top-20", left: "left-[50%]", size: "text-[280px]" },
        { top: "top-5", left: "left-[30%]", size: "text-[250px]" },
        { top: "top-15", left: "left-[70%]", size: "text-[270px]" },
        { top: "top-25", left: "left-[15%]", size: "text-[240px]" },
      ];

      return (
        <>
          {clouds.map((cloud, idx) => (
            <span
              key={`cloud-only-${idx}`}
              className={`absolute ${cloud.top} ${cloud.left} ${cloud.size} opacity-40 animate-pulse`}
            >
              ☁️
            </span>
          ))}
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
          !error && loading && <p className="text-gray-700">Betöltés...</p>
        )}
      </div>
    </div>
  );
}
