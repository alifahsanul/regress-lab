'use client';

import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { fetchRegressionResults } from '../../utils/api';

const MODEL_NAMES = {
  'linear': 'Linear Regression',
  'polynomial': 'Polynomial Regression',
  'tree': 'Decision Tree',
  'dummy': 'Dummy (y=x)'
};

const ControlPanel = () => {
  const {
    selectedModel,
    polynomialDegree,
    treeMaxDepth,
    setSelectedModel,
    setPolynomialDegree,
    setTreeMaxDepth,
    points,
    addRegressionResult,
    clearRegressionResults
  } = useStore();

  // Function to run regression
  const runRegression = async () => {
    if (points.length < 2) {
      alert('At least 2 points are required to run regression');
      return;
    }

    try {
      clearRegressionResults();
      const result = await fetchRegressionResults(
        points,
        selectedModel,
        polynomialDegree,
        treeMaxDepth
      );
      addRegressionResult(result);
    } catch (error) {
      console.error('Error fetching regression results:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Regression Model
        </label>
        <div className="space-y-2">
          {Object.entries(MODEL_NAMES).map(([value, label]) => (
            <label key={value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModel === value}
                onChange={() => setSelectedModel(value as any)}
                className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">You can select up to 2 models.</p>
      </div>

      {selectedModel === 'polynomial' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Polynomial Degree
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={polynomialDegree}
            onChange={(e) => setPolynomialDegree(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">
            Current: {polynomialDegree}
          </div>
        </div>
      )}

      {selectedModel === 'tree' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tree Max Depth
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={treeMaxDepth}
            onChange={(e) => setTreeMaxDepth(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">
            Current: {treeMaxDepth}
          </div>
        </div>
      )}

      <button
        onClick={runRegression}
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
      >
        Run Model
      </button>
    </motion.div>
  );
};

export default ControlPanel;