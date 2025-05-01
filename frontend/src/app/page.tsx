'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Canvas = dynamic(() => import('../components/Canvas/Canvas'), {
  ssr: false
});

const ControlPanel = dynamic(() => import('../components/ControlPanel/ControlPanel'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Interactive Regression Visualization
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4"> {/* Reduced gap for better spacing */}
          <div className="lg:col-span-3 w-full"> {/* Ensure full width for Canvas */}
            <Suspense fallback={<div>Loading canvas...</div>}>
              <Canvas />
            </Suspense>
          </div>
          
          <div className="lg:col-span-1"> {/* ControlPanel remains 1/4 of the width */}
            <Suspense fallback={<div>Loading controls...</div>}>
              <ControlPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}