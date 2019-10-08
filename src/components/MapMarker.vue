<template>
  <div>
    <l-rotated-marker
      :lat-lng="this.flight.position"
      :rotationAngle="this.flight.trueTrack"
    >
      <l-icon>
        <img src="../../src/assets/airplane.svg" alt="asdf" />
      </l-icon>
    </l-rotated-marker>
  </div>
</template>

<script>
import { LIcon } from 'vue2-leaflet';
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';

export default {
  name: 'MapMarker',
  components: {
    LIcon,
    'l-rotated-marker': Vue2LeafletRotatedMarker,
  },
  props: {
    flight: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
