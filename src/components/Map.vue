<template>
  <div>
    <l-map ref="map" :zoom.sync="zoom" :center="center">
      <l-tile-layer :url="url" />
      <span v-if="!isMarkerClicked">
        <l-rotated-marker
          v-for="flight in flights"
          :key="`marker-${flight.icao24}`"
          :lat-lng="flight.position"
          :rotationAngle="flight.trueTrack"
          @click="focusOnFlight(flight)"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="airplane" />
          </l-icon>
        </l-rotated-marker>
      </span>
      <span v-else>
        <LeafletHeatmap :lat-lng="heatmapArray" />
        <l-rotated-marker
          :lat-lng="singleFlight.trackingData.position"
          :rotationAngle="singleFlight.trackingData.trueTrack"
        >
          <l-popup :content="popupData" />
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="airplane" />
          </l-icon>
        </l-rotated-marker>
        <l-control position="bottomleft">
          <button @click="goBack">
            Take me back!
          </button>
        </l-control>
      </span>
    </l-map>
    <Spinner class="spinner" v-if="isSpinnerVisible" />
  </div>
</template>

<script>
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';
import LeafletHeatmap from 'vue2-leaflet-heatmap';
import Spinner from '../components/Spinner';
import { LControl, LIcon, LMap, LTileLayer, LPopup } from 'vue2-leaflet';
import { useMapConfig } from '../consumables/useMapConfig';
import { useFlights } from '../consumables/useFlight';
import { useFocusOnFlight } from '../consumables/useFocusOnFlight';

export default {
  name: 'Map',
  components: {
    Spinner,
    LeafletHeatmap,
    LMap,
    LTileLayer,
    LControl,
    LIcon,
    LPopup,
    'l-rotated-marker': Vue2LeafletRotatedMarker,
  },
  setup() {
    const { zoom, center, url } = useMapConfig();
    const { isSpinnerVisible, flights } = useFlights();
    const {
      popupData,
      isMarkerClicked,
      singleFlight,
      focusOnFlight,
      heatmapArray,
      goBack,
      map,
    } = useFocusOnFlight(center);
    return {
      zoom,
      center,
      url,
      isSpinnerVisible,
      flights,
      popupData,
      isMarkerClicked,
      singleFlight,
      focusOnFlight,
      heatmapArray,
      goBack,
      map,
    };
  },
};
</script>

<style>
.spinner {
  z-index: 9999;
}
</style>
