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
  addPoint: (point: Point) => void;
  removePoint: (index: number) => void;
  updatePoint: (index: number, point: Point) => void;
  setSelectedModel: (model: 'linear' | 'polynomial' | 'tree') => void;
  setPolynomialDegree: (degree: number) => void;
  setTreeMaxDepth: (depth: number) => void;
  clearPoints: () => void;
}

export const useStore = create<RegressionState>((set) => ({
  points: [],
  selectedModel: 'linear',
  polynomialDegree: 2,
  treeMaxDepth: 3,
  
  addPoint: (point) => set((state) => ({
    points: [...state.points, point]
  })),
  
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
})); 