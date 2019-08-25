<template>
  <div id="app">
    <Header msg="Chemtrails Tracker" />
    <MapLoader />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import MapLoader from './components/MapLoader.vue';

export default {
  name: 'app',
  components: {
    Header,
    MapLoader,
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
