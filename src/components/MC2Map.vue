<template>
  <svg height="500" width="100%">
    <g class="world" ref="world"></g>
    <g class="features" ref="features"></g>
  </svg>
</template>

<script>
import MapWithLayers from '@/assets/js/Layers';

const d3 = require('d3');

const map = MapWithLayers(); // component to handle the map

export default {
  name: 'MC2Map',
  props: {
    featureCollection: {
      type: Object,
      default: () => ({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Default point',
            },
            geometry: {
              type: 'Point',
              coordinates: [0, 0],
            },
          },
        ],
      }),
    },
  },
  mounted() {
    const gWorld = d3.select(this.$refs.world);
    const gFeatures = d3.select(this.$refs.features);
    d3.json('/static/data/world.geojson')
      .then((world) => {
        // removing Antartide since there is a problem with the contour geometry
        const fWorld = {
          ...world,
          features: world.features.filter(d => d.properties.CNTR_ID !== 'AQ'),
        };
        gWorld.datum(fWorld)
          .call(map);
      });
    gFeatures.datum(this.featureCollection)
      .call(map);
  },
  watch: {
    featureCollection(newFC) {
      const extentX = d3.extent(newFC.features, d => d.geometry.coordinates[0]);
      const extentY = d3.extent(newFC.features, d => d.geometry.coordinates[1]);
      const centroid = [(extentX[0] + extentX[1]) / 2, (extentY[0] + extentY[1]) / 2];

      map.center(centroid)
        .scale(3000);

      const gFeatures = d3.select(this.$refs.features);
      gFeatures.datum(newFC)
        .call(map);
    },
  },
};
</script>

