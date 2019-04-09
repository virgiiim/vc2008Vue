<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">VC 2008</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Mini Challenge 1</b-nav-item>
          <b-nav-item href="#">Mini Challenge 2</b-nav-item>
          <b-nav-item href="#">Mini Challenge 3</b-nav-item>
          <b-nav-item href="#">Mini Challenge 4</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <MC2MigrantBoats></MC2MigrantBoats>
  </div>
</template>

<script>
import MC2MigrantBoats from '@/components/MC2MigrantBoats';

export default {
  name: 'App',
  components: {
    MC2MigrantBoats,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
