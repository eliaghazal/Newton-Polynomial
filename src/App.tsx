import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { Point } from './types';
import { InteractiveGraph } from './components/InteractiveGraph';
import { DividedDifferencesTable } from './components/DividedDifferencesTable';
import { MathDisplay } from './components/MathDisplay';
import { ControlPanel } from './components/ControlPanel';
import { hasDuplicateX, arePointsTooClose } from './utils/math';

function App() {
  const [points, setPoints] = useState<Point[]>([
    { x: -2, y: 4, id: 'init-1' },
    { x: -1, y: 1, id: 'init-2' },
    { x: 0, y: 0, id: 'init-3' },
    { x: 1, y: 1, id: 'init-4' },
    { x: 2, y: 4, id: 'init-5' },
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showLagrange, setShowLagrange] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Animation logic
  useEffect(() => {
    if (!isPlaying || points.length === 0) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        const next = prev + (0.02 * animationSpeed);
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, points.length, animationSpeed]);

  const handlePlayPause = useCallback(() => {
    if (animationProgress >= 1) {
      setAnimationProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, animationProgress]);

  const handleReset = useCallback(() => {
    setAnimationProgress(0);
    setIsPlaying(false);
  }, []);

  // Check for warnings
  const warnings = [];
  if (hasDuplicateX(points)) {
    warnings.push('Duplicate x-values detected! Interpolation requires unique x-coordinates.');
  }
  if (arePointsTooClose(points)) {
    warnings.push('Some points are very close together. This may lead to numerical instability.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-purple-950/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass border-b border-white/10"
      >
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Newton Polynomial Visualizer
              </h1>
              <p className="text-gray-400 mt-2">
                Advanced Interactive Interpolation Tool
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Points</div>
                <div className="text-2xl font-bold text-white">{points.length}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1920px] mx-auto px-6 py-8">
        {/* Warnings */}
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {warnings.map((warning, idx) => (
              <div
                key={idx}
                className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3 mb-2"
              >
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-yellow-200 text-sm">{warning}</p>
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <div className="xl:col-span-3">
            <ControlPanel
              points={points}
              onPointsChange={setPoints}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              animationSpeed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
              showLagrange={showLagrange}
              onToggleLagrange={() => setShowLagrange(!showLagrange)}
              showTutorial={showTutorial}
              onToggleTutorial={() => setShowTutorial(!showTutorial)}
            />
          </div>

          {/* Middle Column - Graph and Table */}
          <div className="xl:col-span-6 space-y-6">
            {/* Interactive Graph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-6 h-[600px]"
            >
              <InteractiveGraph
                points={points}
                onPointsChange={setPoints}
                showLagrange={showLagrange}
                animationProgress={animationProgress}
              />
            </motion.div>

            {/* Divided Differences Table */}
            <DividedDifferencesTable
              points={points}
              animationProgress={animationProgress}
            />
          </div>

          {/* Right Column - Math Display */}
          <div className="xl:col-span-3">
            <MathDisplay
              points={points}
              animationProgress={animationProgress}
            />
          </div>
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Welcome to Newton Polynomial Visualizer
              </h2>
              
              <div className="space-y-4 text-gray-300">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">What is Newton Interpolation?</h3>
                  <p className="text-sm">
                    Newton polynomial interpolation is a method to find a polynomial that passes through a given set of points.
                    It uses divided differences to efficiently calculate the polynomial coefficients.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">How to Use</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Add Points:</strong> Click anywhere on the graph to add interpolation points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Remove Points:</strong> Double-click on a point to remove it</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Animate:</strong> Use the play button to see step-by-step construction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Presets:</strong> Load example functions to explore different cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Compare:</strong> Toggle Lagrange overlay to verify both methods produce the same result</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">Understanding the Table</h3>
                  <p className="text-sm">
                    The divided differences table shows the calculation progression. The diagonal elements (marked in green)
                    are the coefficients used in Newton's polynomial form. Each column represents a higher level of divided differences.
                  </p>
                </section>
              </div>

              <button
                onClick={() => setShowTutorial(false)}
                className="mt-6 w-full glass-hover px-6 py-3 rounded-xl font-semibold"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 glass border-t border-white/10 mt-12"
      >
        <div className="max-w-[1920px] mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p>Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Plotly.js</p>
          <p className="mt-1">Advanced Newton Polynomial Interpolation Visualizer</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
