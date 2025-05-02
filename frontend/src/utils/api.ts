import { Point, RegressionResult } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchRegressionResults(
  points: Point[],
  regressionType: 'linear' | 'polynomial' | 'tree' | 'dummy',
  polynomialDegree: number = 2,
  treeMaxDepth: number = 3
): Promise<RegressionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        points,
        regression_type: regressionType,
        polynomial_degree: polynomialDegree,
        tree_max_depth: treeMaxDepth,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      modelType: regressionType,
      coefficients: data.coefficients,
      intercept: data.intercept,
      r2_score: data.r2_score,
      predictions: data.predictions,
      line_points: data.line_points,
    };
  } catch (error) {
    console.error('Error fetching regression results:', error);
    throw error;
  }
} 