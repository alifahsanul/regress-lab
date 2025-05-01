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

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([40, width - 40]);
    
    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([height - 30, 30]);

    // Draw axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll('*').remove();

    svg.append('g')
      .attr('transform', `translate(0,${height/2})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${width/2},0)`)
      .call(yAxis);

    // Draw grid lines
    const gridLines = svg.append('g')
      .attr('class', 'grid-lines');

    // Vertical grid lines
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

    // Horizontal grid lines
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

    // Add click handler to add points
    svg.on('click', (event) => {
      const [x, y] = d3.pointer(event);
      const point = {
        x: xScale.invert(x),
        y: yScale.invert(y)
      };
      points.current.push(point);
      
      // Draw points
      svg.selectAll('circle')
        .data(points.current)
        .join('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 5)
        .attr('fill', '#3b82f6')
        .attr('stroke', '#2563eb')
        .attr('stroke-width', 2)
        .attr('cursor', 'pointer');
    });
  }, []);

  return (
    <div className="">
      <svg 
        ref={svgRef}
        className="w-[100px] h-[100px]"
        viewBox="0 0 2000 500"
      />
    </div>
  );
} 