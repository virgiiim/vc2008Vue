<template>
  <vue-plotly :data="data" :layout="layout" :options="options"/>
</template>

<script>
import VuePlotly from '@statnett/vue-plotly';

export default {
  name: 'MC2Chart',
  components: {
    VuePlotly,
  },
  props: {
    cfAggregation: Array,
  },
  data() {
    return {
      data: [{
        type: 'bar',
        x: [1, 3],
        y: [2, 4],
        orientation: 'h',
      }],
      layout: {
        height: 250,
        margin: {
          t: 10,
          l: 70,
          b: 30,
          r: 10,
          pad: 5,
        },
        yaxis: {
          type: 'category',
        },
      },
      options: {
        displayModeBar: false,
      },
    };
  },
  watch: {
    cfAggregation(datum) {
      console.log(datum);
      this.data[0].y = datum.map(d => d.key);
      this.data[0].x = datum.map(d => d.value);
    },
  },
};
</script>
