const d3 = require('d3');

export default function BubbleChart() {
  const field = 'num_call';
  const r = d3.scaleSqrt()
    .domain([0, 1000])
    .range([0, 10]);

  const width = 500;
  const height = 500;

  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-1))
    .force('forceX', d3.forceX(width / 2).strength(0.004))
    .force('forceY', d3.forceY(height / 2).strength(0.004))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => r(d[field]) + 0.5).iterations(5));

  function me(selection) {
    console.log(selection);


    r.domain([0, d3.max(selection.datum(), d => d[field])]);
    simulation.nodes(selection.datum().sort((a,b) => b[field] - a[field]))
      .force('collide', d3.forceCollide().radius(d => r(d[field]) + 0.5).iterations(5));

    const gCircle = selection.selectAll('g.circle')
      .data(selection.datum())
      .enter()
      .append('g')
      .attr('class', 'circle');

    gCircle.append('circle')
      .attr('fill', 'red')
      .attr('fill-opacity', 0.4)
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
      .attr('r', d => r(d[field]));

    simulation.on('tick', () => {
      gCircle
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
  }


  return me;
}
