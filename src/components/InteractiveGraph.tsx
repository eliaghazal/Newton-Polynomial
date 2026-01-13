import React, { useCallback, useMemo, useRef } from 'react';
import Plot from 'react-plotly.js';
import type { Point } from '../types';
import { generatePolynomialCurve, evaluateLagrangePolynomial } from '../utils/math';

interface InteractiveGraphProps {
  points: Point[];
  onPointsChange: (points: Point[]) => void;
  showLagrange: boolean;
  animationProgress?: number;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  points,
  onPointsChange,
  showLagrange,
  animationProgress = 1,
}) => {
  const plotRef = useRef<any>(null);

  // Sort points by x for proper interpolation
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.x - b.x);
  }, [points]);

  // Get visible points based on animation progress
  const visiblePoints = useMemo(() => {
    const count = Math.ceil(sortedPoints.length * animationProgress);
    return sortedPoints.slice(0, count);
  }, [sortedPoints, animationProgress]);

  // Calculate axis ranges
  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    if (sortedPoints.length === 0) {
      return { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
    }

    const xs = sortedPoints.map(p => p.x);
    const ys = sortedPoints.map(p => p.y);
    const xRange = Math.max(...xs) - Math.min(...xs);
    const yRange = Math.max(...ys) - Math.min(...ys);
    
    const xPadding = xRange > 0 ? xRange * 0.2 : 2;
    const yPadding = yRange > 0 ? yRange * 0.2 : 2;

    return {
      xMin: Math.min(...xs) - xPadding,
      xMax: Math.max(...xs) + xPadding,
      yMin: Math.min(...ys) - yPadding,
      yMax: Math.max(...ys) + yPadding,
    };
  }, [sortedPoints]);

  // Generate polynomial curve
  const polynomialCurve = useMemo(() => {
    if (visiblePoints.length < 2) return { x: [], y: [] };
    
    const curve = generatePolynomialCurve(visiblePoints, xMin, xMax, 300);
    return {
      x: curve.map(p => p.x),
      y: curve.map(p => p.y),
    };
  }, [visiblePoints, xMin, xMax]);

  // Generate Lagrange curve (should be identical to Newton)
  const lagrangeCurve = useMemo(() => {
    if (!showLagrange || visiblePoints.length < 2) return { x: [], y: [] };
    
    const numPoints = 300;
    const step = (xMax - xMin) / (numPoints - 1);
    const x: number[] = [];
    const y: number[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const xVal = xMin + i * step;
      x.push(xVal);
      y.push(evaluateLagrangePolynomial(visiblePoints, xVal));
    }
    
    return { x, y };
  }, [showLagrange, visiblePoints, xMin, xMax]);

  // Handle click to add point
  const handleClick = useCallback((event: any) => {
    if (event.points && event.points.length > 0) {
      const clickedPoint = event.points[0];
      
      // Check if clicked on an existing point
      const existingPoint = sortedPoints.find(
        p => Math.abs(p.x - clickedPoint.x) < 0.1 && Math.abs(p.y - clickedPoint.y) < 0.1
      );
      
      if (!existingPoint) {
        // Add new point
        const newPoint: Point = {
          x: clickedPoint.x,
          y: clickedPoint.y,
          id: `point-${Date.now()}-${Math.random()}`
        };
        onPointsChange([...points, newPoint]);
      }
    }
  }, [points, sortedPoints, onPointsChange]);

  // Prepare plot data
  const plotData: any[] = [
    // Newton polynomial curve
    visiblePoints.length >= 2 && {
      x: polynomialCurve.x,
      y: polynomialCurve.y,
      type: 'scatter',
      mode: 'lines',
      name: 'Newton Polynomial',
      line: {
        color: 'rgba(59, 130, 246, 0.9)',
        width: 3,
      },
      hovertemplate: 'x: %{x:.4f}<br>y: %{y:.4f}<extra></extra>',
    },
    // Lagrange polynomial curve (overlay)
    showLagrange && visiblePoints.length >= 2 && {
      x: lagrangeCurve.x,
      y: lagrangeCurve.y,
      type: 'scatter',
      mode: 'lines',
      name: 'Lagrange Polynomial',
      line: {
        color: 'rgba(236, 72, 153, 0.6)',
        width: 2,
        dash: 'dash',
      },
      hovertemplate: 'x: %{x:.4f}<br>y: %{y:.4f}<extra></extra>',
    },
    // Interpolation points
    {
      x: visiblePoints.map(p => p.x),
      y: visiblePoints.map(p => p.y),
      type: 'scatter',
      mode: 'markers',
      name: 'Interpolation Points',
      marker: {
        size: 12,
        color: '#10b981',
        line: {
          color: 'white',
          width: 2,
        },
      },
      hovertemplate: 'Point<br>x: %{x:.4f}<br>y: %{y:.4f}<extra></extra>',
    },
  ].filter(Boolean);

  return (
    <div className="w-full h-full">
      <Plot
        ref={plotRef}
        data={plotData}
        layout={{
          autosize: true,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(15, 23, 42, 0.5)',
          font: { color: '#e2e8f0', family: 'Inter' },
          xaxis: {
            title: { text: 'x' },
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.3)',
            range: [xMin, xMax],
          },
          yaxis: {
            title: { text: 'y' },
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.3)',
            range: [yMin, yMax],
          },
          margin: { l: 60, r: 40, t: 40, b: 60 },
          hovermode: 'closest',
          showlegend: true,
          legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(0,0,0,0.5)',
            bordercolor: 'rgba(255,255,255,0.2)',
            borderwidth: 1,
          },
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: 'newton_polynomial',
            height: 1080,
            width: 1920,
          },
        }}
        onClick={handleClick}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};
