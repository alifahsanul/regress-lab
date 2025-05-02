import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

interface RegressionResult {
  modelType: string;
  coefficients: number[] | null;
  intercept: number | null;
  r2_score: number;
  predictions: number[];
  line_points: Point[];
}

interface RegressionState {
  points: Point[];
  selectedModel: 'linear' | 'polynomial' | 'tree' | 'dummy';
  polynomialDegree: number;
  treeMaxDepth: number;
  regressionResults: RegressionResult[];
  readonly MAX_POINTS: number;
  addPoint: (point: Point) => void;
  removePoint: (index: number) => void;
  updatePoint: (index: number, point: Point) => void;
  setSelectedModel: (model: 'linear' | 'polynomial' | 'tree' | 'dummy') => void;
  setPolynomialDegree: (degree: number) => void;
  setTreeMaxDepth: (depth: number) => void;
  clearPoints: () => void;
  getPointCount: () => number;
  addRegressionResult: (result: RegressionResult) => void;
  clearRegressionResults: () => void;
}

export const useStore = create<RegressionState>((set, get) => ({
  points: [],
  selectedModel: 'linear',
  polynomialDegree: 2,
  treeMaxDepth: 2,
  regressionResults: [],
  MAX_POINTS: 50,
  
  addPoint: (point) => {
    set((state) => {
      const newPoints = [...state.points, point];
      if (newPoints.length > state.MAX_POINTS) {
        // Remove the oldest point (index 0)
        newPoints.shift();
      }
      return { points: newPoints };
    });
  },
  
  removePoint: (index) => set((state) => ({
    points: state.points.filter((_, i) => i !== index)
  })),
  
  updatePoint: (index, point) => set((state) => ({
    points: state.points.map((p, i) => i === index ? point : p)
  })),
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  setPolynomialDegree: (degree) => set({ polynomialDegree: degree }),
  setTreeMaxDepth: (depth) => set({ treeMaxDepth: depth }),
  clearPoints: () => {
    console.log('clearPoints called');
    set({ points: [], regressionResults: [] });
  },
  getPointCount: () => get().points.length,
  
  addRegressionResult: (result) => set((state) => ({
    regressionResults: [...state.regressionResults, result]
  })),
  
  clearRegressionResults: () => set({ regressionResults: [] })
}));