import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface RegressionResult {
  coefficients: number[];
  intercept: number;
  r2_score: number;
  predictions: number[];
}

const Canvas = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { points, selectedModel, polynomialDegree, treeMaxDepth, addPoint, updatePoint } = useStore();
  const [regressionLine, setRegressionLine] = useState<Point[]>([]);
  const [r2Score, setR2Score] = useState<number | null>(null);


  const fitRegression = async () => {
    if (points.length < 2) return;

    try {
      const response = await fetch('http://localhost:8000/api/fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points,
          model_type: selectedModel,
          polynomial_degree: polynomialDegree,
          tree_max_depth: treeMaxDepth,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fit regression');
      }

      const result: RegressionResult = await response.json();
      setR2Score(result.r2_score);

      // Generate points for the regression line
      const xMin = Math.min(...points.map(p => p.x));
      const xMax = Math.max(...points.map(p => p.x));
      const xRange = d3.range(xMin, xMax, (xMax - xMin) / 100);
      
      const linePoints = xRange.map(x => ({
        x,
        y: result.predictions[0] // For now, just use the first prediction
      }));

      setRegressionLine(linePoints);
    } catch (error) {
      console.error('Error fitting regression:', error);
    }
  };

  useEffect(() => {
    fitRegression();
  }, [points, selectedModel, polynomialDegree, treeMaxDepth]);

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
      .range([margin.left, width - margin.right]);

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

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat(() => ''));

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(() => ''));

    // Add regression line
    if (regressionLine.length > 0) {
      const line = d3.line<Point>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      svg.append('path')
        .datum(regressionLine)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('d', line);
    }

    // Add points
    svg.selectAll<SVGCircleElement, Point>('circle')
      .data(points)
      .join('circle')
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
        }));

    // Add click handler for new points
    svg.on('click', (event) => {
      const [x, y] = d3.pointer(event);
      const newPoint = {
        x: xScale.invert(x),
        y: yScale.invert(y)
      };
      addPoint(newPoint);
    });

  }, [points, regressionLine, addPoint, updatePoint]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      <div className="mb-4">
        {r2Score !== null && (
          <div className="text-sm text-gray-600">
            R² Score: {r2Score.toFixed(4)}
          </div>
        )}
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