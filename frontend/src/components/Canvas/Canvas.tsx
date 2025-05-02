'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface RegressionResult {
  modelType: string;
  coefficients: number[] | null;
  intercept: number | null;
  r2_score: number;
  predictions: number[];
  line_points: Point[];
}

// Model type display names
const MODEL_NAMES: { [key: string]: string } = {
  'linear': 'Linear Regression',
  'polynomial': 'Polynomial Regression',
  'tree': 'Decision Tree',
  'dummy': 'Dummy (y=x)'
};

const Canvas = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { points, addPoint, updatePoint, regressionResults } = useStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([margin.left, width - 2 * margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([height - margin.bottom, margin.top]);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

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

    // Add legend if there are regression results
    if (regressionResults.length > 0) {
      const legendGroup = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${margin.left + 10}, ${margin.top + 10})`);

      regressionResults.forEach((result, index) => {
        const legendItem = legendGroup.append('g')
          .attr('transform', `translate(0, ${index * 25})`);

        // Add colored line
        legendItem.append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', colors[index % colors.length])
          .attr('stroke-width', 2);

        // Add model name and R² score
        legendItem.append('text')
          .attr('x', 30)
          .attr('y', 5)
          .attr('font-size', '12px')
          .text(`${MODEL_NAMES[result.modelType]} (R² = ${result.r2_score.toFixed(3)})`);
      });
    }

    // Add points
    const circles = svg.selectAll<SVGCircleElement, Point>('circle')
      .data(points);

    circles.join(
      enter => enter.append('circle')
        .attr('cx', (d: Point) => xScale(d.x))
        .attr('cy', (d: Point) => yScale(d.y))
        .attr('r', 5)
        .attr('fill', '#3b82f6')
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

    console.log('Canvas points:', points);
    console.log('Regression results:', regressionResults);

  }, [points, addPoint, updatePoint, regressionResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      <div className="flex justify-end mb-2 text-sm text-gray-600">
        Points: {points.length}/20
      </div>
      <svg
        ref={svgRef}
        width={500}
        height={400}
        className="border border-gray-200 rounded"
      />
    </motion.div>
  );
};

export default Canvas;