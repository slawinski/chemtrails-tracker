<template>
  <div>
    <l-marker :lat-lng="marker" />
  </div>
</template>

<script>
import svgPlane from '!raw-loader!../assets/airplane.svg';
import { LMarker } from 'vue2-leaflet';
import { latLng } from 'leaflet';

export default {
  name: 'MapMarker',
  components: { LMarker },
  props: {
    flight: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      marker: latLng(52, 19),
    };
  },
  mounted() {
    const parser = new DOMParser();
    const svgPath = parser
      .parseFromString(svgPlane, 'image/svg+xml')
      .querySelector('path')
      .getAttribute('d');

    new this.google.maps.Marker({
      position: this.flight.position,
      flight: this.flight,
      map: this.map,
      // TODO: extract to object
      icon: {
        path: svgPath,
        scale: 0.04,
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeWeight: 1,
        rotation: this.flight.trueTrack,
        anchor: new this.google.maps.Point(250, 400),
      },
    });
  },
};
</script>

<style scoped></style>
