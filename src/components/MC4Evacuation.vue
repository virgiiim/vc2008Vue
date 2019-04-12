<template>
  <b-container>
    <b-row>
      <h1>Evacuation traces</h1>
    </b-row>
    <b-row>
      <b-col>
        <h2>Building Map</h2>
        <svg width="100%" height="500">
          <g class="building" ref="building"></g>
        </svg>
      </b-col>
      <b-col cols="2">
        <h2>Persons</h2>
        <div style="height:500px; background-color: lightyellow"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BuildingBitmap from '@/assets/BuildingBitmap';
const d3 = require('d3');
export default {
  name: 'MC4Evacuation',
  mounted() {
    fetch('/static/data/building_map.txt')
      .then(response => response.text())
      .then((map) => {
        const aMap = map.split('\n').map(d => d.trim().split(' ').map(e => +e));
        console.log('map', aMap);

        const bb = BuildingBitmap();
        d3.select(this.$refs.building)
          .datum(aMap)
          .call(bb);
      });
  },
};
</script>

<style scoped>

</style>
