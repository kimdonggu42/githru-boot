import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { precipitationData } from '../data/precipitationData';

function BarChart() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 1000;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  useEffect(() => {
    const svg = d3.select(svgRef.current).attr('viewBox', `0,0,${width},${height}`);

    const xScale = d3
      .scaleBand()
      .domain(precipitationData.map((data) => data.date) as Iterable<string>)
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(precipitationData, (data) => data.precipitation)] as [number, number])
      .range([height - margin.bottom, margin.top])
      .nice();

    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale));

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    svg.append<SVGGElement>('g').call(xAxis);
    svg.append<SVGGElement>('g').call(yAxis);

    svg
      .append('g')
      .selectAll('rect')
      .data(precipitationData)
      .enter()
      .append('rect')
      .attr('x', (data) => xScale(data.date) as number)
      .attr('y', (data) => yScale(data.precipitation))
      .attr('width', xScale.bandwidth())
      .attr('height', (data) => yScale(0) - yScale(data.precipitation))
      .attr('class', 'bar-chart')
      .attr('fill', 'steelblue');
  }, []);

  return (
    <>
      <h1> Bar Chart </h1>
      <svg ref={svgRef} />
    </>
  );
}

export default BarChart;
