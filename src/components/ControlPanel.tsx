import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Shuffle,
  Lightbulb,
} from 'lucide-react';
import type { Point, PresetFunction } from '../types';
import { presetFunctions, generateRandomPoints } from '../utils/presets';

interface ControlPanelProps {
  points: Point[];
  onPointsChange: (points: Point[]) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  showLagrange: boolean;
  onToggleLagrange: () => void;
  showTutorial: boolean;
  onToggleTutorial: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  points,
  onPointsChange,
  isPlaying,
  onPlayPause,
  onReset,
  animationSpeed,
  onSpeedChange,
  showLagrange,
  onToggleLagrange,
  showTutorial,
  onToggleTutorial,
}) => {
  const handlePresetSelect = (preset: PresetFunction) => {
    onPointsChange(preset.points);
  };

  const handleRandomPoints = () => {
    const count = Math.floor(Math.random() * 5) + 4; // 4-8 points
    onPointsChange(generateRandomPoints(count));
  };

  const handleClearPoints = () => {
    onPointsChange([]);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(points, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'newton-polynomial-points.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          onPointsChange(imported);
        }
      } catch (error) {
        console.error('Failed to import points:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Animation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Animation Controls
        </h3>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={onPlayPause}
            disabled={points.length === 0}
            className="flex-1 glass-hover px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <button
            onClick={onReset}
            disabled={points.length === 0}
            className="glass-hover px-4 py-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset Animation"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Animation Speed</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">{animationSpeed.toFixed(1)}x</div>
        </div>
      </motion.div>

      {/* Preset Functions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
          Preset Functions
        </h3>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {presetFunctions.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              className="w-full text-left glass-hover px-4 py-3 rounded-xl transition-all"
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs text-gray-400 mt-1">{preset.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleRandomPoints}
          className="w-full mt-3 glass-hover px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Shuffle size={18} />
          <span>Random Points</span>
        </button>
      </motion.div>

      {/* Point Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
          Point Management
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            disabled={points.length === 0}
            className="glass-hover px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span className="text-sm">Export</span>
          </button>
          
          <label className="glass-hover px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Upload size={18} />
            <span className="text-sm">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleClearPoints}
            disabled={points.length === 0}
            className="col-span-2 glass-hover px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-red-400"
          >
            <Trash2 size={18} />
            <span className="text-sm">Clear All Points</span>
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Total Points: <span className="text-white font-semibold">{points.length}</span>
        </div>
      </motion.div>

      {/* Display Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
          Display Options
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Show Lagrange Comparison</span>
            <input
              type="checkbox"
              checked={showLagrange}
              onChange={() => onToggleLagrange()}
              className="w-5 h-5 rounded"
            />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Tutorial Mode</span>
            <input
              type="checkbox"
              checked={showTutorial}
              onChange={() => onToggleTutorial()}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-400" />
          <span>Quick Guide</span>
        </h3>
        
        <ul className="text-sm space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Click on the graph to add points</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Double-click points to remove them</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Use animation controls to see step-by-step interpolation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Hover over table cells for formulas</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
