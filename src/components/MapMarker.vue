<template>
  <div></div>
</template>

<script>
  import svgPlane from '!raw-loader!../assets/airplane.svg';

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
    const parser = new DOMParser();
    const svgPath = parser
      .parseFromString(svgPlane, "image/svg+xml")
      .querySelector('path')
      .getAttribute('d');

    new this.google.maps.Marker({
      position: this.flight.position,
      flight: this.flight,
      map: this.map,
      icon: {
        path: svgPath,
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
