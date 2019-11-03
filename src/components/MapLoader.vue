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
        <LeafletHeatmap v-if="latLngArray" :lat-lng="latLngArray" />
        <l-rotated-marker
          :lat-lng="singleFlight.position"
          :rotationAngle="singleFlight.trueTrack"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="airplane" />
          </l-icon>
        </l-rotated-marker>
        <l-control position="bottomleft">
          <button @click="clickHandler(singleFlight.position)">
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
import FlightsService from '../services/flights.service';
import { mapFlightsData } from '../utils/map';
import Spinner from './Spinner';
import { LControl, LIcon, LMap, LTileLayer } from 'vue2-leaflet';
import { latLng } from 'leaflet';

export default {
  name: 'Map',
  components: {
    Spinner,
    LeafletHeatmap,
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
      singleFlight: [],
      isSpinnerVisible: false,
      latLngArray: [],
    };
  },
  methods: {
    createHeatMap(position) {
      return [
        [position.lat, position.lng, 1],
        [position.lat - 0.1, position.lng, 1],
        [position.lat - 0.2, position.lng, 1],
        [position.lat - 0.3, position.lng, 1],
        [position.lat - 0.4, position.lng, 1],
      ];
    },
    clickHandler() {
      this.isMarkerClicked = false;
      this.center = latLng(52, 19);
      this.zoom = 6;
    },
    async focusOnFlight(flight) {
      this.isSpinnerVisible = true;
      this.latLngArray = this.createHeatMap(flight.position);
      let rawRouteData = [];
      try {
        rawRouteData = await FlightsService.showRoute(flight.callSign);
        this.singleFlight = rawRouteData.data;
        this.singleFlight.position = flight.position;
        this.singleFlight.trueTrack = flight.trueTrack;
        this.isMarkerClicked = true;
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
      rawFlightsData = await FlightsService.getAll();
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
