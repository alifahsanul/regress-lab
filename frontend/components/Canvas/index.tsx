'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Point {
  x: number;
  y: number;
}

export default function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const points = useRef<Point[]>([]);
  const scales = useRef<{ xScale: d3.ScaleLinear<number, number, never> | null; yScale: d3.ScaleLinear<number, number, never> | null }>({
    xScale: null,
    yScale: null,
  });

  const updateScales = () => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const padding = 50; // Add padding to ensure full range is visible
    const widthShrinkCoef = 0.95

    // Update scales to map [-10, 10] to the canvas dimensions with padding
    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([0, (width - padding) * widthShrinkCoef]);

    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([(height - padding), 0]);

    // Store scales in a ref for use in the click handler
    scales.current = { xScale, yScale };

    // Redraw axes
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0, ${height / 2 - 1 * padding / 2})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${(width - padding) * widthShrinkCoef / 2},0)`)
      .call(yAxis);

    // Redraw grid lines
    const gridLines = svg.append('g')
      .attr('class', 'grid-lines');

    gridLines.selectAll('.vertical-grid')
      .data(xScale.ticks(10))
      .enter()
      .append('line')
      .attr('class', 'vertical-grid')
      .attr('x1', d => xScale(d))
      .attr('y1', 0)
      .attr('x2', d => xScale(d))
      .attr('y2', height)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    gridLines.selectAll('.horizontal-grid')
      .data(yScale.ticks(10))
      .enter()
      .append('line')
      .attr('class', 'horizontal-grid')
      .attr('x1', 0)
      .attr('y1', d => yScale(d))
      .attr('x2', width)
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Add click handler to add points
    svg.on('click', (event) => {
      if (!scales.current.xScale || !scales.current.yScale) return;

      const [x, y] = d3.pointer(event);
      const point = {
        x: scales.current.xScale.invert(x),
        y: scales.current.yScale.invert(y)
      };
      points.current.push(point);

      // Draw points
      svg.selectAll('circle')
        .data(points.current)
        .join('circle')
        .attr('cx', d => scales.current.xScale!(d.x))
        .attr('cy', d => scales.current.yScale!(d.y))
        .attr('r', 5)
        .attr('fill', '#3b82f6')
        .attr('stroke', '#2563eb')
        .attr('stroke-width', 2)
        .attr('cursor', 'pointer');
    });

    updateScales();
    window.addEventListener('resize', updateScales);

    return () => {
      window.removeEventListener('resize', updateScales);
    };
  }, []);

  useEffect(() => {
    const updateViewBox = () => {
      if (svgRef.current) {
        const width = window.innerWidth * 0.9; // x% of the viewport width
        const height = window.innerHeight * 0.5; // x% of the viewport height
        svgRef.current.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }
    };

    updateViewBox(); // Set initial viewBox
    window.addEventListener('resize', updateViewBox); // Update on resize

    return () => {
      window.removeEventListener('resize', updateViewBox);
    };
  }, []);

  return (
    <div className="w-full h-[100vh]"> {/* Removed flex centering to avoid extra white space */}
      <svg 
        ref={svgRef}
        className="w-[80vh] h-[20vh]"
        viewBox="0 0"
      />
    </div>
  );
}