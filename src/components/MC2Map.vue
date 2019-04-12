<template>
  <svg height="500" width="100%">
    <g class="world" ref="world"></g>
    <g class="reports" ref="reports"></g>
  </svg>
</template>

<script>
import MapWithLayers from '@/assets/js/Layers';

const d3 = require('d3');

const map = MapWithLayers(); // component to handle the map

export default {
  name: 'MC2Map',
  mounted() {
    const gWorld = d3.select(this.$refs.world);
    d3.json('assets/data/world.geojson')
      .then((world) => {
        // removing Antartide since there is a problem with the contour geometry
        const fWorld = {
          ...world,
          features: world.features.filter(d => d.properties.CNTR_ID != 'AQ'),
        };
        gWorld.datum(fWorld)
          .call(map);
      });
  },
};
</script>

