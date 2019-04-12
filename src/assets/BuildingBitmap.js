const d3 = require('d3');

export default function buildingBitmap() {
  function me(selection) {
    const gr = selection.selectAll('g.row')
      .data(selection.datum())
      .enter()
      .append('g')
      .classed('row', true)
      .attr('transform', (d, i) => `translate(0,${i * 10})`);

    const wallColor = d3.scaleOrdinal()
      .domain([0, 1])
      .range(['white', 'lightgray']);

    gr.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 10)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => wallColor(d));
  }

  return me;
}
