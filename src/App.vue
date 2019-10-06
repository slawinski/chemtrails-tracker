<template>
  <div id="app">
    <Header msg="Chemtrails Tracker" />
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker :lat-lng="marker" />
    </l-map>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { latLng } from 'leaflet';

export default {
  name: 'app',
  components: {
    Header,
    LMap,
    LMarker,
    LTileLayer,
  },
  data() {
    return {
      zoom: 13,
      center: latLng(52, 19),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: latLng(52, 19),
    };
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
