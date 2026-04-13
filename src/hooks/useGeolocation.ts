import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('A böngésződ nem támogatja a helymeghatározást.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => setError('Nem sikerült meghatározni a helyet. Engedélyezd a helymeghatározást.'),
    );
  }, []);

  return { coords, error };
};