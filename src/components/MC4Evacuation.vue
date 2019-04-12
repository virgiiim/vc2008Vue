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
          <g class="trajectories" ref="trajectories"></g>
        </svg>
      </b-col>
      <b-col cols="3">
        <h2>Persons</h2>
        <b-list-group class="personList">
          <b-list-group-item v-for="p in persons" :key="p.id"
          class="d-flex justify-content-between align-items-center">
            <b-badge variant="primary" pill>{{p.id}}</b-badge>
            {{p.person}}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BuildingBitmap from '@/assets/BuildingBitmap';
import TrajectoryView from '@/assets/TRajectoryView';

const d3 = require('d3');


function euclideanDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export default {
  name: 'MC4Evacuation',
  data() {
    return {
      persons: [],
    };
  },
  mounted() {
    fetch('/static/data/building_map.txt')
      .then(response => response.text())
      .then((map) => {
        const aMap = map.split('\n').map(d => d.trim().split(' ').map(e => +e));
        const bb = BuildingBitmap();
        d3.select(this.$refs.building)
          .datum(aMap)
          .call(bb);
      });

    d3.tsv('/static/data/rfid_assignments.txt')
      .then((rows) => {
        const ids = rows
          .filter((row) => {
            const entries = d3.values(row);
            return (entries[0].length > 0); // ignore rows with invalid id (not numeric)
          })
          .map((row) => {
            const entries = d3.values(row);
            return {
              id: +entries[0],
              person: entries[1],
            };
          });
        this.persons = ids;
      });

    d3.tsv('/static/data/rfid_pathway.txt')
      .then((rows) => {
        const paths = rows.map(row => ({
          person: +row.Person,
          time: +row.Time,
          x: +row.xcor,
          y: +row.ycor,
        }));
        const trajs = d3.nest()
          .key(d => d.person)
          .entries(paths);

        const trs = d3.values(trajs).map((d) => {
          const pl = d.values.map((p, i) => {
            if (i == 0) return 0;
            return euclideanDistance(p, d.values[i - 1]);
          });
          return {
            person: +d.key,
            values: d.values.map(p => ({ x: p.x, y: p.y })),
            path_length: pl.reduce((a, b) => a + b, 0),
            delta_s: pl,
          };
        });

        console.log('trajs', trajs);
        console.log('trs', trs);

        const trajectories = TrajectoryView();
        d3.select(this.$refs.trajectories)
          .datum(trs)
          .call(trajectories);

        // timeline = TimelineBrush().domain([0,trs[0].values.length]);
        // d3.select("#timeline")
        // .call(timeline);

        // d3.select("#status")
        // .call(me.statusbar);
      });
  },
};
</script>

<style scoped>
  .personList{
    height: 600px;
    overflow: scroll;
    overflow-style: marquee-block ;
  }
</style>
