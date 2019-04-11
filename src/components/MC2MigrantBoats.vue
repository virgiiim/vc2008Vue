<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form-group label="Select a year">
          <b-form-checkbox-group
            v-model="year.value"
            :options="year.options"
            name="buttonsYear"
            buttons
          ></b-form-checkbox-group>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Select a boat type">
          <b-form-checkbox-group
            v-model="boatType.value"
            :options="boatType.options"
            name="buttonsBoats"
            buttons
          ></b-form-checkbox-group>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Select a record type">
          <b-form-checkbox-group
            v-model="recordType.value"
            :options="recordType.options"
            name="buttonsRecords"
            buttons
          ></b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="map">
      <b-col cols="9">
        <h3>Map</h3>
        <div style="height:500px; background-color: beige"></div>
      </b-col>
      <b-col>
        <h3>Counters</h3>
        <div style="height:400px; background-color: beige">
          <Counter measure="# Records" :value="numRecords"></Counter>
          <Counter measure="# Passengers" :value="numPassengers"></Counter>
          <Counter measure="# Deaths" :value="numDeaths"></Counter>
        </div>
      </b-col>
    </b-row>
    <b-row class="plots">
      <b-col>
        <h5>Year</h5>
        <div style="height:200px; background-color: beige">
          <Chart :cfAggregation="dataYear"></Chart>
        </div>
      </b-col>
      <b-col>
        <h5>Boat Type</h5>
        <div style="height:200px; background-color: beige">
          <Chart :cfAggregation="dataBoat"></Chart>
        </div>
      </b-col>
      <b-col>
        <h5>Interdictions</h5>
        <div style="height:200px; background-color: beige">
          <Chart :cfAggregation="dataRecord"></Chart>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import crossfilter from 'crossfilter';
import Counter from '@/components/MC2Counter';
import Chart from '@/components/MC2Chart';

// crossfilter data management
let cf; // crossfilter instance
let dYear; // dimension for Year
let dRecordType; // dimension for RecordType
let dVesselType; // dimension for VesselType

export default {
  name: 'MC2MigrantBoats',
  components: {
    Counter,
    Chart,
  },
  data() {
    return {
      year: {
        value: 2001,
        options: [2001, 2002, 2003],
      },
      boatType: {
        value: 'All',
        options: ['All', 'Rustic', 'Raft'],
      },
      recordType: {
        value: 'All',
        options: ['All', 'Interdiction', 'Landing'],
      },
      numRecords: 0,
      numPassengers: 0,
      numDeaths: 0,
      dataYear: [],
      dataBoat: [],
      dataRecord: [],
    };
  },
  mounted() {
    fetch('/static/data/migrant.json')
      .then(res => res.json())
      .then((res) => {
        const reports = res.map((d) => {
          const r = {
            EncounterDate: d.EncounterDate,
            NumDeaths: +d.NumDeaths,
            Passengers: +d.Passengers,
            RecordNotes: d.RecordNotes,
            RecordType: d.RecordType,
            USCG_Vessel: d.USCG_Vessel,
            VesselType: d.VesselType,
            year: +d.EncounterDate.split('-')[0], // extract only year
          };
          // if(d.EncounterCoords)
          r.EncounterCoords = [+d.EncounterCoords[0], +d.EncounterCoords[1]];
          // if(d.LaunchCoords)
          r.LaunchCoords = [+d.LaunchCoords[0], +d.LaunchCoords[1]];

          return r;
        });


        // initialize Crossfilter
        cf = crossfilter(reports);
        dYear = cf.dimension(d => d.year);
        dRecordType = cf.dimension(d => d.RecordType);
        dVesselType = cf.dimension(d => d.VesselType);

        this.year.options = dYear.group().reduceCount().all().map(v => v.key);
        this.year.value = this.year.options[0];

        this.boatType.options = ['All'].concat(dVesselType.group().reduceCount().all().map(v => v.key));
        this.boatType.value = this.boatType.options[0];

        this.recordType.options = ['All'].concat(dRecordType.group().reduceCount().all().map(v => v.key));
        this.recordType.value = this.recordType.options[0];

        this.refreshCounters();
        this.refreshCharts();
      });
  },
  methods: {
    refreshCounters() {
      this.numRecords = cf.groupAll().reduceCount().value();
      this.numPassengers = cf.groupAll().reduceSum(d => d.Passengers).value();
      this.numDeaths = cf.groupAll().reduceSum(d => d.NumDeaths).value();
    },
    refreshCharts() {
      this.dataYear = dYear.group().reduceCount().all();
      this.dataBoat = dVesselType.group().reduceCount().all();
      this.dataRecord = dRecordType.group().reduceCount().all();
    },
  },
  watch: {
    year: {
      handler(newVal) {
        dYear.filter(newVal.value);
        this.refreshCounters();
        this.refreshCharts();
      },
      deep: true, // force watching within properties
    },
    boatType: {
      handler(newVal) {
        if (newVal.value === 'All') {
          dVesselType.filter(null);
        } else {
          dVesselType.filter(newVal.value);
        }

        this.refreshCounters();
        this.refreshCharts();
      },
      deep: true, // force watching within properties
    },
    recordType: {
      handler(newVal) {
        if (newVal.value === 'All') {
          dRecordType.filter(null);
        } else {
          dRecordType.filter(newVal.value);
        }

        this.refreshCounters();
        this.refreshCharts();
      },
      deep: true, // force watching within properties
    },
  },
};
</script>

<style scoped>

</style>
