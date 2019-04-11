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
          l: 10,
          b: 10,
          r: 10,
        },
      },
      options: {
        displayModeBar: false,
      },
    };
  },
};
</script>
