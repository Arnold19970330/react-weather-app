// src/components/weather/utils/weatherHelpers.ts

export interface Position {
  left: string;
  delay: string;
  duration: string;
}

export const generateRandomPositions = (
  numberOfDrops: number,
  bands: { minLeft: number; maxLeft: number }[],
  minDuration: number,
  maxDuration: number
): Position[] => {
  const positions: Position[] = [];

  for (let i = 0; i < numberOfDrops; i++) {
    const randomBand = bands[Math.floor(Math.random() * bands.length)];
    const randomLeft =
      Math.floor(Math.random() * (randomBand.maxLeft - randomBand.minLeft + 1)) +
      randomBand.minLeft;

    positions.push({
      left: `left-[${randomLeft}%]`,
      delay: (Math.random() * 2).toFixed(1) + "s",
      duration: (Math.random() * (maxDuration - minDuration) + minDuration).toFixed(1) + "s",
    });
  }
  return positions;
};

export const convertTemp = (tempC: number, unit: 'c' | 'f'): number => {
  return unit === 'c' ? Math.round(tempC) : Math.round(tempC * 1.8 + 32);
};