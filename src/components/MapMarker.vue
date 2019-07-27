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
        path: "M497.25,357v-51l-204-127.5V38.25C293.25,17.85,275.4,0,255,0c-20.4,0-38.25,17.85-38.25,38.25V178.5L12.75,306v51l204-63.75V433.5l-51,38.25V510L255,484.5l89.25,25.5v-38.25l-51-38.25V293.25L497.25,357z",
        scale: .04,
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeWeight: 1,
        rotation: this.flight.trueTrack,
        anchor: new this.google.maps.Point(250, 400)
      }
    })

  }
}
</script>

<style scoped>

</style>
