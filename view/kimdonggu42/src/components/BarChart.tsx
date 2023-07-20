import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { precipitationData } from '../data/precipitationData';

function BarChart() {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const xScale = d3
      .scaleBand()
      .domain(precipitationData.map((d) => d.date) as Iterable<string>)
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(precipitationData, (d) => d.precipitation)] as [number, number])
      .range([height - margin.bottom, margin.top])
      .nice();

    const svg = d3
      .select(divRef.current)
      .call((g) => g.select('svg').remove())
      .append('svg')
      .attr('viewBox', `0,0,${width},${height}`);

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
      .attr('x', (d) => xScale(d.date) as number)
      .attr('y', (d) => yScale(d.precipitation))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.precipitation))
      .attr('class', 'bar-chart')
      .attr('fill', 'steelblue');
  }, []);

  return (
    <>
      <h1> Bar Chart </h1>
      <div ref={divRef} />
    </>
  );
}

export default BarChart;
