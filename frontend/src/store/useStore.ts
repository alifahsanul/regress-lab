import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

interface RegressionState {
  points: Point[];
  selectedModel: 'linear' | 'polynomial' | 'tree';
  polynomialDegree: number;
  treeMaxDepth: number;
  readonly MAX_POINTS: number;
  addPoint: (point: Point) => void;
  removePoint: (index: number) => void;
  updatePoint: (index: number, point: Point) => void;
  setSelectedModel: (model: 'linear' | 'polynomial' | 'tree') => void;
  setPolynomialDegree: (degree: number) => void;
  setTreeMaxDepth: (depth: number) => void;
  clearPoints: () => void;
  getPointCount: () => number;
}

export const useStore = create<RegressionState>((set, get) => ({
  points: [],
  selectedModel: 'linear',
  polynomialDegree: 2,
  treeMaxDepth: 3,
  MAX_POINTS: 20,
  
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
  clearPoints: () => set({ points: [] }),
  getPointCount: () => get().points.length,
})); 