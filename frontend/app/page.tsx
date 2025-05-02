'use client';

import React, { useState } from 'react';
import Canvas from '../src/components/Canvas/Canvas';
import { useStore } from '../src/store/useStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { clearRegressionResults, addRegressionResult } = useStore();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const points = useStore(state => state.points);

  const handleModelChange = (model: string, checked: boolean) => {
    if (checked) {
      if (selectedModels.length === 2) {
        setSelectedModels([selectedModels[1], model]); // Remove oldest, add new
      } else {
        setSelectedModels([...selectedModels, model]);
      }
    } else {
      setSelectedModels(selectedModels.filter(m => m !== model));
    }
  };

  const handleRunModel = async () => {
    if (points.length < 2) {
      setError('Not enough data');
      return;
    }
    if (selectedModels.length === 0) {
      setError('Please select at least 1 model');
      return;
    }
    const allXSame = points.every(p => p.x === points[0].x);
    if (allXSame) {
      setError('Regression cannot be performed: all x values are the same.');
      return;
    }
    setError(null);
    clearRegressionResults(); // Clear previous results

    // Call backend API for each selected model
    for (const model of selectedModels) {
      try {
        const response = await fetch('http://localhost:8000/api/fit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            points: points.map(p => ({ x: p.x, y: p.y })),
            regression_type: model,
            polynomial_degree: 2,
            tree_max_depth: 2
          })
        });
        if (!response.ok) {
          let err;
          try {
            err = await response.json();
          } catch (e) {
            err = { detail: response.statusText };
          }
          setError(
            typeof err === 'string'
              ? err
              : err.detail || err.msg || JSON.stringify(err)
          );
          return;
        }
        const data = await response.json();
        console.log('Regression result for', model, data);
        
        // Add regression result to store
        addRegressionResult({
          modelType: model,
          coefficients: data.coefficients,
          intercept: data.intercept,
          r2_score: data.r2_score,
          predictions: data.predictions,
          line_points: data.line_points
        });
      } catch (err) {
        setError('Failed to connect to backend');
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Regression Lab</h1>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 bg-red-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Existing main content */}
      <main className="w-full px-2 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Main visualization area */}
          <div className="lg:col-span-3 bg-gray-50 rounded-lg p-4">
            <Canvas />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">Model Choice</h2>
              <div className="mt-4 flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="linear"
                    checked={selectedModels.includes('linear')}
                    onChange={e => handleModelChange('linear', e.target.checked)}
                    className="form-checkbox text-blue-600"
                  />
                  Linear Regression
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="polynomial"
                    checked={selectedModels.includes('polynomial')}
                    onChange={e => handleModelChange('polynomial', e.target.checked)}
                    className="form-checkbox text-blue-600"
                  />
                  Polynomial Regression
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="tree"
                    checked={selectedModels.includes('tree')}
                    onChange={e => handleModelChange('tree', e.target.checked)}
                    className="form-checkbox text-blue-600"
                  />
                  Decision Tree Regression
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="dummy"
                    checked={selectedModels.includes('dummy')}
                    onChange={e => handleModelChange('dummy', e.target.checked)}
                    className="form-checkbox text-blue-600"
                  />
                  Dummy Regressor (y=x)
                </label>
                <p className="text-xs text-gray-500 mt-2">You can select up to 2 models.</p>
                <button
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                  type="button"
                  onClick={handleRunModel}
                >
                  Run model
                </button>
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Control panel */}
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Control panel is now empty */}
          </div>
        </div>
      </main>
    </div>
  );
}
