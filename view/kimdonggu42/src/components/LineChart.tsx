import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { tempData } from '../data/tempData';

interface ConverDateInterface {
  date: Date;
  temp: number;
}

function LineChart() {
  const data = tempData.map((value) => ({
    date: new Date(value.date),
    temp: value.temp,
  }));
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 1000;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  useEffect(() => {
    const svg = d3.select(svgRef.current).attr('viewBox', `0,0,${width},${height}`);

    const xScale = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.temp), d3.max(data, (d) => d.temp)] as [number, number])
      .range([height - margin.bottom, margin.top])
      .nice();

    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale));

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    const line = d3
      .line<ConverDateInterface>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.temp));

    svg.append<SVGGElement>('g').call(xAxis);
    svg.append<SVGGElement>('g').call(yAxis);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line(data));
  }, [data]);

  return (
    <>
      <h1> Line Chart </h1>
      <svg ref={svgRef} />
    </>
  );
}

export default LineChart;
