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
    </b-row>
    <b-row class="map">
      <b-col cols="9">
        <h3>Map</h3>
        <div style="height:400px; background-color: beige"></div>
      </b-col>
      <b-col>
        <h3>Counters</h3>
        <div style="height:400px; background-color: beige"></div>
      </b-col>
    </b-row>
    <b-row class="plots">
      <b-col>
        <h5>Year</h5>
        <div style="height:200px; background-color: beige"></div>
      </b-col>
      <b-col>
        <h5>Boat Type</h5>
        <div style="height:200px; background-color: beige"></div>
      </b-col>
      <b-col>
        <h5>Interdictions</h5>
        <div style="height:200px; background-color: beige"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import crossfilter from 'crossfilter';

// crossfilter data management
let cf; // crossfilter instance
let dYear; // dimension for Year
let dRecordType; // dimension for RecordType
let dMonth; // dimension for Month
let dVesselType; // dimension for VesselType

export default {
  name: 'MC2MigrantBoats',
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
      reports: [],
    };
  },
  mounted() {
    fetch('/static/data/migrant.json')
      .then(res => res.json())
      .then((res) => {
        this.reports = res.map((d) => {
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
        cf = crossfilter(this.reports);
        dYear = cf.dimension(d => d.year);
        dRecordType = cf.dimension(d => d.RecordType);
        dVesselType = cf.dimension(d => d.VesselType);

        // dRecordType.filterAll();
        console.log('years', dYear.group().reduceCount().all());
        console.log('recordType', dRecordType.group().reduceCount().all());
        console.log('vesselType', dVesselType.group().reduceCount().all());

        this.year.options = dYear.group().reduceCount().all().map(v => v.key);
        this.year.value = this.year.options[0];

        this.boatType.options = dVesselType.group().reduceCount().all().map(v => v.key);
        this.boatType.value = this.boatType.options[0];

        // select count(*) from migrants where VesselType=="Rustic”
        // dVesselType.filter("Go Fast");
        console.log('num reports (Go Fast)', cf.groupAll().reduceCount());
        // select sum(Passengers) from migrants where VesselType=="Rustic”
        console.log('num passengers (Go Fast)', cf.groupAll().reduceSum(d => d.Passengers).value());
        // select sum(NumDeaths) from migrants where VesselType=="Rustic”
        console.log('num deaths (Go Fast)', cf.groupAll().reduceSum(d => d.NumDeaths));
        // select VesselType, count(*) from migrants group by VesselType
        const countVesselType = dVesselType.group().reduceCount();
        console.log(countVesselType.all());

        // how many report?
        // select count(*) from migrants
        console.log('num reports', cf.groupAll().reduceCount().value());

        // select sum(Passengers) from migrants
        console.log('num passengers', cf.groupAll().reduceSum(d => d.Passengers).value());

        // select sum(NumDeaths) from migrants
        console.log('num deaths', cf.groupAll().reduceSum(d => d.NumDeaths).value());
      });
  },
};
</script>

<style scoped>

</style>
