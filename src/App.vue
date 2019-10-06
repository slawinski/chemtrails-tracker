<template>
  <div id="app">
    <Header msg="Chemtrails Tracker" />
    <map-loader />
  </div>
</template>

<script>
import Header from './components/Header';
import MapLoader from './components/MapLoader';

export default {
  name: 'app',
  components: {
    Header,
    MapLoader,
  },
};
</script>

<style>
@import '../node_modules/leaflet/dist/leaflet.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-rows: 20% 80%;
  height: 100vh;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
}
</style>
