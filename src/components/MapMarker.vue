<template>
  <div></div>
</template>

<script>

export default {
  name: 'MapMarker',
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    flight: {
      type: Object,
      required: true
    }
  },
  mounted() {
    new this.google.maps.Marker({
      position: this.flight.position,
      flight: this.flight,
      map: this.map,
      icon: {
        // TODO: get path from svg (https://stackoverflow.com/a/8125957/9259091)
        path: "M134.875,19.74c0.04-22.771,34.363-22.771,34.34,0.642v95.563L303,196.354v35.306l-133.144-43.821v71.424l30.813,24.072v27.923l-47.501-14.764l-47.501,14.764v-27.923l30.491-24.072v-71.424L3,231.66v-35.306l131.875-80.409V19.74z",
        scale: .1,
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeWeight: 2,
        rotation: this.flight.trueTrack
      }
    })

  }
}
</script>

<style scoped>

</style>
