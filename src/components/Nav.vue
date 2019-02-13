<template>
  <div class="nav">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: center;

  grid-row: 1/2;
  position: relative;
}
</style>
