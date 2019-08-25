<template>
  <img class="spinner rotate" src="../assets/return.svg" alt="" />
</template>

<script>
export default {
  name: 'Spinner',
};
</script>

<style scoped>
.spinner {
  width: 5rem;
  height: 5rem;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.rotate {
  transform-origin: 50% 50%;
  animation: rotation 2s infinite steps(20);
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}
</style>
