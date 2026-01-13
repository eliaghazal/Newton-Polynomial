import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Point } from '../types';
import { getNewtonCoefficients } from '../utils/math';
import 'katex/dist/katex.min.css';

interface MathDisplayProps {
  points: Point[];
  animationProgress?: number;
}

export const MathDisplay: React.FC<MathDisplayProps> = ({
  points,
  animationProgress = 1,
}) => {
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.x - b.x);
  }, [points]);

  const visibleCount = Math.ceil(sortedPoints.length * animationProgress);
  const visiblePoints = sortedPoints.slice(0, visibleCount);

  const coefficients = useMemo(() => {
    return getNewtonCoefficients(visiblePoints);
  }, [visiblePoints]);

  // Build Newton formula step by step
  const newtonFormula = useMemo(() => {
    if (visiblePoints.length === 0) return 'P(x) = 0';
    
    let formula = 'P(x) = ';
    
    for (let i = 0; i < visiblePoints.length; i++) {
      const coeff = coefficients[i];
      
      // Add sign for terms after the first
      if (i > 0) {
        formula += coeff >= 0 ? ' + ' : ' - ';
      } else if (coeff < 0) {
        formula += '-';
      }
      
      // Add coefficient
      formula += Math.abs(coeff).toFixed(4);
      
      // Add product terms
      if (i > 0) {
        for (let j = 0; j < i; j++) {
          const xVal = visiblePoints[j].x;
          if (xVal >= 0) {
            formula += `(x - ${xVal.toFixed(2)})`;
          } else {
            formula += `(x + ${Math.abs(xVal).toFixed(2)})`;
          }
        }
      }
    }
    
    return formula;
  }, [visiblePoints, coefficients]);

  // Build divided differences notation
  const dividedDifferencesNotation = useMemo(() => {
    if (visiblePoints.length === 0) return '';
    
    const terms: string[] = [];
    
    for (let i = 0; i < visiblePoints.length; i++) {
      let term = 'f[';
      
      if (i === 0) {
        term += `x_0]`;
      } else {
        term += `x_0, ..., x_${i}]`;
      }
      
      // Add product
      if (i > 0) {
        term += ' \\prod_{j=0}^{' + (i - 1) + '} (x - x_j)';
      }
      
      terms.push(term);
    }
    
    return 'P(x) = ' + terms.join(' + ');
  }, [visiblePoints]);

  if (visiblePoints.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-gray-400">
        <p>Add points to see the mathematical formulas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Newton's Forward Difference Formula */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Newton's Forward Difference Formula
        </h3>
        <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
          <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-all">
            {dividedDifferencesNotation}
          </div>
        </div>
      </motion.div>

      {/* Expanded Polynomial Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Expanded Polynomial
        </h3>
        <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
          <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-all">
            {newtonFormula}
          </div>
        </div>
      </motion.div>

      {/* Coefficients Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
          Newton Coefficients
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {coefficients.map((coeff, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-3"
            >
              <div className="text-xs text-gray-400 mb-1">
                a<sub>{idx}</sub>
              </div>
              <div className="font-mono text-sm text-white">
                {coeff.toFixed(6)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Degree Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Polynomial Degree:</span>
          <span className="font-semibold text-white">
            {visiblePoints.length - 1}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {visiblePoints.length} points → degree {visiblePoints.length - 1} polynomial
        </div>
      </motion.div>
    </div>
  );
};
