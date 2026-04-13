export default function WeatherCard({ weather }: { weather: any }) {
  return (
    <>
      <img src={weather.current.condition.icon} className="mx-auto" />

      <h2 className="text-2xl font-semibold mt-2">
        {weather.location.name}
      </h2>

      <p className="text-4xl">{weather.current.temp_c}°C</p>
    </>
  );
}