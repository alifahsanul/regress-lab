'use client';

import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

const ControlPanel = () => {
  const {
    selectedModel,
    polynomialDegree,
    treeMaxDepth,
    setSelectedModel,
    setPolynomialDegree,
    setTreeMaxDepth,
    clearPoints
  } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold mb-4">Regression Model</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="model"
              value="linear"
              checked={selectedModel === 'linear'}
              onChange={(e) => setSelectedModel('linear')}
              className="form-radio text-blue-600"
            />
            <span>Linear Regression</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="model"
              value="polynomial"
              checked={selectedModel === 'polynomial'}
              onChange={(e) => setSelectedModel('polynomial')}
              className="form-radio text-blue-600"
            />
            <span>Polynomial Regression</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="model"
              value="tree"
              checked={selectedModel === 'tree'}
              onChange={(e) => setSelectedModel('tree')}
              className="form-radio text-blue-600"
            />
            <span>Decision Tree Regression</span>
          </label>
        </div>
      </div>

      {selectedModel === 'polynomial' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Polynomial Degree
          </label>
          <input
            type="range"
            min="2"
            max="5"
            value={polynomialDegree}
            onChange={(e) => setPolynomialDegree(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{polynomialDegree}</span>
        </div>
      )}

      {selectedModel === 'tree' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Tree Depth
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={treeMaxDepth}
            onChange={(e) => setTreeMaxDepth(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{treeMaxDepth}</span>
        </div>
      )}
    </motion.div>
  );
};

export default ControlPanel;