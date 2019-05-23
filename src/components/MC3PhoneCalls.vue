<template>
  <b-container>
    <b-row>
      <h1>MC3 - Phone calls</h1>
    </b-row>
    <b-row>
      <b-col>
        <svg width="100%" height="500">
          <g class="persons" ref="persons"></g>
        </svg>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BubbleChart from '@/assets/BubbleChart';

const d3 = require('d3');

const dispatch = d3.dispatch('toggleCircle');
const bc = BubbleChart()
  .dispatch(dispatch);

export default {
  name: 'MC3PhoneCalls',
  data() {
    return {
      calls: [],
    };
  },
  mounted() {
    d3.csv('/static/data/CellPhoneCallRecords.csv')
      .then(((rows) => {
        // https://github.com/d3/d3-time-format
        const tp = d3.timeParse('%Y%m%d %H%M');
        this.calls = rows.map(r => ({
          f: +r.From,
          t: +r.To,
          dt: tp(r.Datetime),
          duration: +r['Duration(seconds)'],
          cid: +r['Cell Tower'],
          selected: false,
        }));

        // registering for custom event
        dispatch.on('toggleCircle', (c) => {
          c.selected = !c.selected;
          console.log(c);
          d3.select(this.$refs.persons)
            .call(bc);
        });

        d3.select(this.$refs.persons)
          .datum(this.users())
          .call(bc);
      }));
  },
  methods: {
    users() {
      return d3.nest()
        .key(d => +d.f)
        .rollup(lv => ({
          duration: d3.sum(lv, r => r.duration),
          num_call: lv.length,
          num_contacts: d3.set(lv, r => r.t).size(),
        }))
        .entries(this.calls)
        .map(d => ({ f: +d.key, ...d.value }));
    },
  },
};
</script>

