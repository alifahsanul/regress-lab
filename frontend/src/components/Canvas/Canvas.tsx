'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { fetchRegressionResults } from '../../utils/api';
import { Point, RegressionResult } from '../../types';

// Model type display names
const MODEL_NAMES: { [key: string]: string } = {
  'linear': 'Linear Regression',
  'polynomial': 'Polynomial Regression',
  'tree': 'Decision Tree',
  'dummy': 'Dummy (y=x)'
};

const Canvas = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    points,
    addPoint,
    updatePoint,
    regressionResults,
    clearPoints,
    MAX_POINTS,
    selectedModel,
    polynomialDegree,
    treeMaxDepth,
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

  // Effect to handle D3 visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([margin.left, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([height - margin.bottom, margin.top]);

    // Add center vertical line (y-axis)
    svg.append('line')
      .attr('class', 'axis-line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    // Add center horizontal line (x-axis)
    svg.append('line')
      .attr('class', 'axis-line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.left - margin.right)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    // Add x-axis ticks and labels
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', '#374151');

    // Add y-axis ticks and labels
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', '#374151');

    // Create line generator
    const lineGenerator = d3.line<Point>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Draw regression lines
    const colors = ['#3b82f6', '#10b981', '#8b5cf6']; // blue, green, purple
    regressionResults.forEach((result, index) => {
      // Draw the line
      svg.append('path')
        .datum(result.line_points)
        .attr('fill', 'none')
        .attr('stroke', colors[index % colors.length])
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    });

    // Add points
    const circles = svg.selectAll<SVGCircleElement, Point>('circle')
      .data(points);

    circles.join(
      enter => enter.append('circle')
        .attr('cx', (d: Point) => xScale(d.x))
        .attr('cy', (d: Point) => yScale(d.y))
        .attr('r', 5)
        .attr('fill', '#6b7280')
        .call(d3.drag<SVGCircleElement, Point>()
          .on('drag', (event, d) => {
            const x = xScale.invert(event.x);
            const y = yScale.invert(event.y);
            const index = points.findIndex((p: Point) => p === d);
            updatePoint(index, { x, y });
          })
        ),
      update => update
        .attr('cx', (d: Point) => xScale(d.x))
        .attr('cy', (d: Point) => yScale(d.y)),
      exit => exit.remove()
    );

    // Add click handler for new points
    svg.on('click', (event) => {
      const [x, y] = d3.pointer(event);
      const newPoint = {
        x: xScale.invert(x),
        y: yScale.invert(y)
      };
      addPoint(newPoint);
    });

  }, [points, addPoint, updatePoint, regressionResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      <div className="text-sm text-gray-600 mb-2">
        Points: {points.length}/{MAX_POINTS}
      </div>
      <svg
        ref={svgRef}
        width={500}
        height={400}
        className="border border-gray-200 rounded"
      />
      <div className="mt-4">
        <button
          onClick={clearPoints}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Clear Points
        </button>
      </div>
      {regressionResults.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4">
          <div className="text-sm font-medium text-gray-700">Regression Results:</div>
          <div className="flex flex-col gap-2">
            {regressionResults.map((result, index) => {
              const colors = ['#3b82f6', '#10b981', '#8b5cf6']; // Keep colors consistent
              return (
                <div key={`${result.modelType}-${index}`} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-0.5" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span 
                    className="text-sm text-gray-700"
                    style={{ color: colors[index % colors.length] }}
                  >
                    {MODEL_NAMES[result.modelType]} (R² = {result.r2_score.toFixed(3)})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Canvas;