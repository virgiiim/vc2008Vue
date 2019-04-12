/**
 *
 *  This module will display a map with a symbol encoding for a set of geographical elements
 */

const d3 = require('d3');

export default function MapWithLayers() {
  let projection = d3.geoMercator();
  let scale = 100; // default value for scale
  let center = [0, 0]; // default value for centering the map
  let path;
  let gmap;

  function me(selection) {
    console.log('MapWithLayers', selection.datum());

    const boundaries = selection.node().parentNode.getBoundingClientRect();
    console.log('dimensions', boundaries);
    projection = d3.geoMercator()
      .scale(scale)
      .center(center)
      .translate([boundaries.width / 2, boundaries.height / 2]);

    path = d3.geoPath().projection(projection);

    // path.pointRadius(function(d){
    // 	return radius(d.properties.count);
    // })


    // create a group container for map

    const paths = selection.selectAll('path')
      .data(selection.datum().features);

    paths.exit().remove();

    paths.enter()
      .append('path');

    selection.selectAll('path').attr('d', path);
  }


  // getter and setter for variable scale
  me.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    projection.scale(scale);

    return me;
  };

  // getter and setter for variable center
  me.center = function (_) {
    if (!arguments.length) return center;
    center = _;
    projection.center(center);

    return me;
  };
  return me;
}
