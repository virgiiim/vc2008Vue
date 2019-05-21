<template>
  <b-container>
    <b-row>
      <h1>MC3 - Phone calls</h1>
    </b-row>
    <b-row>
      <b-col>
        <svg width="100%" height="500">
          <g class="persons" red="persons"></g>
        </svg>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'MC3PhoneCalls',
  data() {
    return {
      calls: [],
    };
  },
};
</script>

