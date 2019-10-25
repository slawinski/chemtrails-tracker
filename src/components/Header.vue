<template>
  <div class="header">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;

  grid-row: 1/2;
  position: relative;
}
</style>
