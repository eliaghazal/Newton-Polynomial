import type { Point, PresetFunction } from '../types';

/**
 * Generate points from a function
 */
function generatePoints(
  func: (x: number) => number,
  xMin: number,
  xMax: number,
  count: number
): Point[] {
  const points: Point[] = [];
  const step = (xMax - xMin) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const x = xMin + i * step;
    points.push({
      x,
      y: func(x),
      id: `preset-${i}-${Date.now()}`
    });
  }
  
  return points;
}

/**
 * Preset function examples
 */
export const presetFunctions: PresetFunction[] = [
  {
    name: 'Sine Wave',
    description: 'f(x) = sin(x) from 0 to 2π',
    func: Math.sin,
    points: generatePoints(Math.sin, 0, 2 * Math.PI, 7)
  },
  {
    name: 'Cosine Wave',
    description: 'f(x) = cos(x) from 0 to 2π',
    func: Math.cos,
    points: generatePoints(Math.cos, 0, 2 * Math.PI, 7)
  },
  {
    name: 'Exponential',
    description: 'f(x) = e^x from -2 to 2',
    func: Math.exp,
    points: generatePoints(Math.exp, -2, 2, 6)
  },
  {
    name: 'Natural Logarithm',
    description: 'f(x) = ln(x) from 0.5 to 3',
    func: Math.log,
    points: generatePoints(Math.log, 0.5, 3, 6)
  },
  {
    name: 'Quadratic',
    description: 'f(x) = x² from -3 to 3',
    func: (x) => x * x,
    points: generatePoints((x) => x * x, -3, 3, 7)
  },
  {
    name: 'Cubic',
    description: 'f(x) = x³ - 3x from -2 to 2',
    func: (x) => x * x * x - 3 * x,
    points: generatePoints((x) => x * x * x - 3 * x, -2, 2, 7)
  },
  {
    name: "Runge's Phenomenon",
    description: 'f(x) = 1/(1+25x²) from -1 to 1',
    func: (x) => 1 / (1 + 25 * x * x),
    points: generatePoints((x) => 1 / (1 + 25 * x * x), -1, 1, 11)
  },
  {
    name: 'Absolute Value',
    description: 'f(x) = |x| from -3 to 3',
    func: Math.abs,
    points: generatePoints(Math.abs, -3, 3, 7)
  },
  {
    name: 'Simple Linear',
    description: 'f(x) = 2x + 1 from -2 to 2',
    func: (x) => 2 * x + 1,
    points: generatePoints((x) => 2 * x + 1, -2, 2, 5)
  }
];

/**
 * Generate random points
 */
export function generateRandomPoints(count: number, xMin: number = -5, xMax: number = 5): Point[] {
  const points: Point[] = [];
  
  for (let i = 0; i < count; i++) {
    points.push({
      x: xMin + Math.random() * (xMax - xMin),
      y: -5 + Math.random() * 10,
      id: `random-${i}-${Date.now()}`
    });
  }
  
  // Sort by x value
  return points.sort((a, b) => a.x - b.x);
}
