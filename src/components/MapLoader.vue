<template>
  <div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-rotated-marker
        v-for="flight in flights"
        :key="`marker-${flight.id}`"
        :lat-lng="flight.position"
        :rotationAngle="flight.trueTrack"
      >
        <l-icon>
          <img src="../../src/assets/airplane.svg" alt="asdf" />
        </l-icon>
      </l-rotated-marker>
    </l-map>
    <Spinner v-if="!(flights.length > 0)" />
  </div>
</template>

<script>
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';

import FlightService from '../services/flights.service';
import Spinner from './Spinner';
import { LMap, LTileLayer, LIcon } from 'vue2-leaflet';
import { latLng } from 'leaflet';

export default {
  name: 'Map',
  components: {
    Spinner,
    LMap,
    LTileLayer,
    LIcon,
    'l-rotated-marker': Vue2LeafletRotatedMarker,
  },
  data() {
    return {
      zoom: 6,
      center: latLng(52, 19),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      flights: [],
    };
  },
  methods: {
    mapFlightDataToFlights(flightData) {
      flightData.data.states.map(item => {
        const obj = {
          id: item[0],
          callSign: item[1],
          originCountry: item[2],
          position: {
            lat: item[6],
            lng: item[5],
          },
          onGround: item[8],
          velocity: item[9],
          trueTrack: item[10],
        };
        this.flights.push(obj);
      });
    },
  },
  async mounted() {
    try {
      const flightData = await FlightService.getAll();
      this.mapFlightDataToFlights(flightData);
    } catch (error) {
      // TODO: implement message plugin
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
};
</script>

<style>
.map {
  grid-row: 2/3;
  height: 100%;
}
</style>
