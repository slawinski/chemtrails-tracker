<template>
  <div id="app">
    <Map />
    <notifications group="api" position="top right" />
  </div>
</template>

<script>
import Map from './components/Map';

export default {
  name: 'App',
  components: {
    Map,
  },
};
</script>

<style>
#app {
  display: grid;
  height: 100vh;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
