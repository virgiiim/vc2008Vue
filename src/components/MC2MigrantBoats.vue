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
        <div style="height:500px">
          <Map :featureCollection="pointCollection"></Map>
        </div>
      </b-col>
      <b-col>
        <h3>Counters</h3>
        <div style="height:400px">
          <Counter measure="# Records" :value="numRecords"></Counter>
          <Counter measure="# Passengers" :value="numPassengers"></Counter>
          <Counter measure="# Deaths" :value="numDeaths"></Counter>
        </div>
      </b-col>
    </b-row>
    <b-row class="plots">
      <b-col>
        <h5>Year</h5>
        <div style="height:300px">
          <Chart :cfAggregation="dataYear"></Chart>
        </div>
      </b-col>
      <b-col>
        <h5>Boat Type</h5>
        <div style="height:300px">
          <Chart :cfAggregation="dataBoat"></Chart>
        </div>
      </b-col>
      <b-col>
        <h5>Interdictions</h5>
        <div style="height:300px">
          <Chart :cfAggregation="dataRecord"></Chart>
        </div>
      </b-col>
    </b-row>
    <b-row class="description">
      <p>The map shows a visual representation of the migrant flows over three years
        from the Isla de Sueno towards United States and Mexico. Each point on the map
        represent an event registered by the US Coast Guard: a green point represent
        a landing point of the boat; a red point represent an interdiction of the Coast
        Guard in that position. The map and the linked displays with charts and statistics
        allow to understand the evolution of the migration during the three years.</p>
      <p>The number of boats has increased along the years. On average there are 150 more
        attempts with respect to the previous year. The proportion of the three types of
        vessels (Rustic, Raft, Go Fast) is constant. There is no evidence that a vessel
        type is more effective than the others. Considering the respective group of
        records of type <b-link @click="setRecordType('Landing')">Landing</b-link>  and
        <b-link @click="setRecordType('Interdiction')">Interdiction</b-link> , the ratio
        of the three type of vessels is comparable.</p>
      <p>The effectiveness of the Coast Guard during the three years shows an interdiction
        every two attempts, with a success rate of around 51%. However, this performance
        has lowered during the years. In <b-link @click="setYear('2005')">2005</b-link>
        it was around 70%. In <b-link @click="setYear('2006')">2006</b-link> has lowered
        to 56%, and in <b-link @click="setYear('2007')">2007</b-link></p>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue';
import crossfilter from 'crossfilter';
import Counter from '@/components/MC2Counter';
import Chart from '@/components/MC2Chart';
import Map from '@/components/MC2Map';

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
    Map,
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
      pointCollection: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Default point',
            },
            geometry: {
              type: 'Point',
              coordinates: [1, 1],
            },
          },
        ],
      },
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
        // select one of the dimensions at the beginning: they are equivalent
        this.refreshMap(dYear);
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
    refreshMap(cfDimension) {
      this.pointCollection = this.getGeoJsonFromReports(cfDimension.top(Infinity));
    },
    getGeoJsonFromReports(reports) {
      const fc = {
        type: 'FeatureCollection',
        features: reports
          .map((d) => { // for each entry in record dictionary
            if (d.EncounterCoords) {
              return {
                type: 'Feature',
                properties: {
                  EncounterDate: d.EncounterDate,
                  NumDeaths: +d.NumDeaths,
                  Passengers: +d.Passengers,
                  RecordNotes: d.RecordNotes,
                  RecordType: d.RecordType,
                  USCG_Vessel: d.USCG_Vessel,
                  VesselType: d.VesselType,
                  year: d.year,
                },
                geometry: {
                  type: 'Point',
                  coordinates: d.EncounterCoords,
                },
              };
            }
          }),
      };
      return fc;
    },
    setRecordType(selector) {
      Vue.set(this.recordType, 'value', selector);
    },
    setYear(selector) {
      Vue.set(this.year, 'value', selector);
    },
  },
  watch: {
    year: {
      handler(newVal) {
        dYear.filter(newVal.value);
        this.refreshCounters();
        this.refreshCharts();
        this.refreshMap(dYear);
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
        this.refreshMap(dVesselType);
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
        this.refreshMap(dRecordType);
      },
      deep: true, // force watching within properties
    },
  },
};
</script>

<style scoped>

</style>
