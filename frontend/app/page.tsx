import Canvas from '../components/Canvas';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full px-2 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Regression Lab</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Main visualization area */}
          <div className="lg:col-span-3 bg-gray-50 rounded-lg p-4">
            <Canvas />
          </div>

          {/* Control panel */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Model Type</h3>
                <select className="w-full p-2 border rounded">
                  <option value="linear">Linear Regression</option>
                  <option value="polynomial">Polynomial Regression</option>
                  <option value="decision-tree">Decision Tree</option>
                </select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Parameters</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm">Degree (Polynomial)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      defaultValue="2"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Statistics</h3>
                <div className="bg-white p-2 rounded">
                  <p className="text-sm">R² Score: <span className="font-mono">0.00</span></p>
                </div>
              </div>

              <div>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  Clear Points
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
