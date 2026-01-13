export interface Point {
  x: number;
  y: number;
  id: string;
}

export interface DividedDifferenceCell {
  value: number;
  formula?: string;
  level: number;
  rowIndex: number;
}

export interface PolynomialTerm {
  coefficient: number;
  powers: { x: number; }[];
}

export interface PresetFunction {
  name: string;
  description: string;
  points: Point[];
  func?: (x: number) => number;
}
