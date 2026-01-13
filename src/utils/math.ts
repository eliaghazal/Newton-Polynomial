import type { Point, DividedDifferenceCell } from '../types';

/**
 * Calculate divided differences table for Newton interpolation
 * Returns a 2D array where table[i][j] represents the j-th divided difference at point i
 */
export function calculateDividedDifferences(points: Point[]): number[][] {
  if (points.length === 0) return [];
  
  const n = points.length;
  const table: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // First column is just the y values
  for (let i = 0; i < n; i++) {
    table[i][0] = points[i].y;
  }
  
  // Calculate divided differences
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (points[i + j].x - points[i].x);
    }
  }
  
  return table;
}

/**
 * Evaluate Newton polynomial at a given x value
 */
export function evaluateNewtonPolynomial(points: Point[], x: number): number {
  if (points.length === 0) return 0;
  
  const table = calculateDividedDifferences(points);
  let result = table[0][0];
  let product = 1;
  
  for (let i = 1; i < points.length; i++) {
    product *= (x - points[i - 1].x);
    result += table[0][i] * product;
  }
  
  return result;
}

/**
 * Generate points for plotting the Newton polynomial curve
 */
export function generatePolynomialCurve(
  points: Point[],
  xMin: number,
  xMax: number,
  numPoints: number = 200
): { x: number; y: number }[] {
  if (points.length === 0) return [];
  
  const curve: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / (numPoints - 1);
  
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    const y = evaluateNewtonPolynomial(points, x);
    curve.push({ x, y });
  }
  
  return curve;
}

/**
 * Calculate Lagrange basis polynomial L_i(x)
 */
function lagrangeBasis(points: Point[], i: number, x: number): number {
  let result = 1;
  for (let j = 0; j < points.length; j++) {
    if (i !== j) {
      result *= (x - points[j].x) / (points[i].x - points[j].x);
    }
  }
  return result;
}

/**
 * Evaluate Lagrange polynomial at a given x value
 */
export function evaluateLagrangePolynomial(points: Point[], x: number): number {
  if (points.length === 0) return 0;
  
  let result = 0;
  for (let i = 0; i < points.length; i++) {
    result += points[i].y * lagrangeBasis(points, i, x);
  }
  
  return result;
}

/**
 * Format Newton polynomial as a string (LaTeX format)
 */
export function formatNewtonPolynomial(points: Point[]): string {
  if (points.length === 0) return 'P(x) = 0';
  if (points.length === 1) return `P(x) = ${points[0].y.toFixed(4)}`;
  
  const table = calculateDividedDifferences(points);
  let terms: string[] = [];
  
  // First term
  terms.push(table[0][0].toFixed(4));
  
  // Subsequent terms
  for (let i = 1; i < points.length; i++) {
    const coeff = table[0][i];
    if (Math.abs(coeff) < 1e-10) continue;
    
    const sign = coeff >= 0 ? '+' : '';
    let term = `${sign}${coeff.toFixed(4)}`;
    
    // Build the product (x - x_0)(x - x_1)...
    for (let j = 0; j < i; j++) {
      const xVal = points[j].x;
      if (xVal >= 0) {
        term += `(x - ${xVal.toFixed(2)})`;
      } else {
        term += `(x + ${(-xVal).toFixed(2)})`;
      }
    }
    
    terms.push(term);
  }
  
  return `P(x) = ${terms.join(' ')}`;
}

/**
 * Get the diagonal coefficients (Newton form coefficients)
 */
export function getNewtonCoefficients(points: Point[]): number[] {
  if (points.length === 0) return [];
  const table = calculateDividedDifferences(points);
  const coefficients: number[] = [];
  
  for (let i = 0; i < points.length; i++) {
    coefficients.push(table[0][i]);
  }
  
  return coefficients;
}

/**
 * Check if points have duplicate x values
 */
export function hasDuplicateX(points: Point[]): boolean {
  const xValues = new Set<number>();
  for (const point of points) {
    if (xValues.has(point.x)) return true;
    xValues.add(point.x);
  }
  return false;
}

/**
 * Check if points are too close together (ill-conditioned)
 */
export function arePointsTooClose(points: Point[], threshold: number = 0.01): boolean {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (Math.abs(points[i].x - points[j].x) < threshold) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get formatted divided difference cells for table display
 */
export function getDividedDifferenceCells(points: Point[]): DividedDifferenceCell[][] {
  if (points.length === 0) return [];
  
  const table = calculateDividedDifferences(points);
  const cells: DividedDifferenceCell[][] = [];
  
  for (let i = 0; i < points.length; i++) {
    const row: DividedDifferenceCell[] = [];
    for (let j = 0; j < points.length - i; j++) {
      row.push({
        value: table[i][j],
        level: j,
        rowIndex: i,
        formula: j > 0 ? `f[x${i},...,x${i+j}]` : `f[x${i}]`
      });
    }
    cells.push(row);
  }
  
  return cells;
}
