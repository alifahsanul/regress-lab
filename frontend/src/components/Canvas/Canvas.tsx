'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

const Canvas = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { points, addPoint, updatePoint } = useStore();

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

  }, [points, addPoint, updatePoint]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
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