export interface Point {
  x: number;
  y: number;
}

export interface RegressionResult {
  modelType: string;
  coefficients: number[] | null;
  intercept: number | null;
  r2_score: number;
  predictions: number[];
  line_points: Point[];
} 