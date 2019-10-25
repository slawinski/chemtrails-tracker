<template>
  <div id="app">
    <map-loader />
  </div>
</template>

<script>
import MapLoader from './components/MapLoader';

export default {
  name: 'app',
  components: {
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
  height: 100vh;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
}
</style>
