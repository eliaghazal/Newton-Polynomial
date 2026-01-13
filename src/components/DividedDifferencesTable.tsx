import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Point } from '../types';
import { calculateDividedDifferences } from '../utils/math';

interface DividedDifferencesTableProps {
  points: Point[];
  animationProgress?: number;
}

export const DividedDifferencesTable: React.FC<DividedDifferencesTableProps> = ({
  points,
  animationProgress = 1,
}) => {
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.x - b.x);
  }, [points]);

  const visibleCount = Math.ceil(sortedPoints.length * animationProgress);
  const visiblePoints = sortedPoints.slice(0, visibleCount);

  const table = useMemo(() => {
    return calculateDividedDifferences(visiblePoints);
  }, [visiblePoints]);

  if (visiblePoints.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-gray-400">
        <p>Add points to see the divided differences table</p>
      </div>
    );
  }

  const getLevelColor = (level: number) => {
    const colors = [
      'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      'from-red-500/20 to-red-600/20 border-red-500/30',
      'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      'from-green-500/20 to-green-600/20 border-green-500/30',
    ];
    return colors[level % colors.length];
  };

  return (
    <div className="glass rounded-2xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Divided Differences Table
        </span>
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-400">i</th>
                <th className="px-3 py-2 text-left text-sm text-gray-400">x<sub>i</sub></th>
                {Array.from({ length: visiblePoints.length }).map((_, idx) => (
                  <th key={idx} className="px-3 py-2 text-center text-sm text-gray-400">
                    {idx === 0 ? 'f[x_i]' : `f[...,x_{i+${idx}}]`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiblePoints.map((point, rowIdx) => (
                <motion.tr
                  key={point.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.1 }}
                  className="border-t border-white/5"
                >
                  <td className="px-3 py-3 text-sm text-gray-400">{rowIdx}</td>
                  <td className="px-3 py-3 text-sm font-mono">
                    {point.x.toFixed(3)}
                  </td>
                  {table[rowIdx]?.map((value, colIdx) => {
                    const isCoefficient = rowIdx === 0;
                    return (
                      <motion.td
                        key={colIdx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (rowIdx + colIdx) * 0.05 }}
                        className="px-3 py-3"
                      >
                        <div
                          className={`
                            relative px-3 py-2 rounded-lg text-center font-mono text-sm
                            bg-gradient-to-br ${getLevelColor(colIdx)}
                            border ${isCoefficient ? 'ring-2 ring-green-500/50' : ''}
                            transition-all duration-200 hover:scale-105
                            group cursor-help
                          `}
                          title={`${isCoefficient ? 'Newton Coefficient: ' : ''}f[x${rowIdx}${colIdx > 0 ? `,...,x${rowIdx + colIdx}` : ''}] = ${value.toFixed(6)}`}
                        >
                          {value.toFixed(4)}
                          {isCoefficient && (
                            <div className="absolute -top-1 -right-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>
                      </motion.td>
                    );
                  })}
                  {/* Empty cells for triangular structure */}
                  {Array.from({ length: rowIdx }).map((_, idx) => (
                    <td key={`empty-${idx}`} className="px-3 py-3" />
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-blue-400">💡 Tip:</span> The diagonal 
          elements (marked with green) are the coefficients used in Newton's polynomial form.
          Each level uses a different color to show the calculation progression.
        </p>
      </div>
    </div>
  );
};
