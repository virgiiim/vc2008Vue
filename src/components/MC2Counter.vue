<template>
  <b-row class="counter mb-2">
    <b-col>
      <b-card bg-variant="light" :header="measure" class="text-center">
        <b-card-text><h1>{{value}}</h1></b-card-text>
      </b-card>

    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'MC2Counter',
  props: {
    measure: String,
    value: Number,
  },
};
</script>
