<template>
  <div>
    <l-map :zoom.sync="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
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
        <l-rotated-marker
          :lat-lng="singleFlight.trackingData.position"
          :rotationAngle="singleFlight.trackingData.trueTrack"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="airplane" />
          </l-icon>
        </l-rotated-marker>
        <l-control position="bottomleft">
          <button @click="clickHandler()">
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
import { getAll, showRoute, showAircraft } from '../services/flights.service';
import { mapFlightsData, mapRouteData } from '../utils/map';
import Spinner from './Spinner';
import { LControl, LIcon, LMap, LTileLayer } from 'vue2-leaflet';
import { latLng } from 'leaflet';

export default {
  name: 'Map',
  components: {
    Spinner,
    LMap,
    LTileLayer,
    LControl,
    LIcon,
    'l-rotated-marker': Vue2LeafletRotatedMarker,
  },
  data() {
    return {
      isMarkerClicked: false,
      zoom: 6,
      center: latLng(52, 19),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      flights: [],
      singleFlight: {},
      isSpinnerVisible: false,
    };
  },
  methods: {
    clickHandler() {
      this.isMarkerClicked = false;
      this.center = latLng(52, 19);
      this.zoom = 6;
    },
    async focusOnFlight(flight) {
      this.isSpinnerVisible = true;
      this.isMarkerClicked = true;
      this.singleFlight.trackingData = flight;
      let rawRouteData = {};
      let rawAircraftData = {};
      try {
        // TODO if no callsign throws error but could provide aircraft information instead
        // extract into separate async functions
        rawRouteData = await showRoute(flight.callSign);
        this.singleFlight.route = await mapRouteData(rawRouteData.data);
        rawAircraftData = await showAircraft(flight.icao24);
        this.singleFlight.aircraft = rawAircraftData.data;
      } catch (error) {
        // TODO: implement message plugin
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isSpinnerVisible = false;
      }
    },
  },
  async mounted() {
    this.isSpinnerVisible = true;
    let rawFlightsData = [];
    try {
      rawFlightsData = await getAll();
    } catch (error) {
      // TODO: implement message plugin
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.flights = mapFlightsData(rawFlightsData);
      this.isSpinnerVisible = false;
    }
  },
};
</script>

<style>
.spinner {
  z-index: 9999;
}
</style>
