<template>
  <div>
    <l-map ref="map" :zoom.sync="zoom" :center="center">
      <l-tile-layer :url="url" />
      <Hotline :lat-lngs="flights" :min="990" :max="1000" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet';
import { useMapConfig } from '../consumables/useMapConfig';
import { useFlights } from '../consumables/useFlight';
import Hotline from './Hotline';

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    Hotline,
  },
  setup() {
    return {
      ...useMapConfig(),
      ...useFlights(),
    };
  },
};
</script>
