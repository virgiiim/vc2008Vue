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
    };
  },
};
</script>

<style scoped>

</style>
