<template>
  <div id="app">
    <Nav msg="Welcome to Chemtrails Tracker!"/>
    <Map/>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue";
import Map from "./components/Map.vue";

export default {
  name: "app",
  components: {
    Nav,
    Map
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
