<template>
  <div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-rotated-marker
        v-for="(flight, index) in flights"
        :key="`marker-${flight.icao24}`"
        :lat-lng="flight.position"
        :rotationAngle="flight.trueTrack"
        @click="focusOnFlight(index)"
      >
        <l-icon>
          <img src="../../src/assets/airplane.svg" alt="asdf" />
        </l-icon>
        <l-popup :content="popupMessage(flight)"></l-popup>
      </l-rotated-marker>
    </l-map>
    <Spinner v-if="!(flights.length > 0)" />
  </div>
</template>

<script>
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';

import FlightService from '../services/flights.service';
import Spinner from './Spinner';
import { LMap, LTileLayer, LIcon, LPopup } from 'vue2-leaflet';
import { latLng } from 'leaflet';

export default {
  name: 'Map',
  components: {
    Spinner,
    LMap,
    LTileLayer,
    LIcon,
    LPopup,
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
    // TODO move to utils
    mapFlightState(flightData) {
      flightData.data.states.map(item => {
        const obj = {
          icao24: item[0],
          callSign: item[1],
          originCountry: item[2],
          timePosition: item[3],
          last_contact: item[4],
          position: {
            lat: item[6],
            lng: item[5],
          },
          baroAltitude: item[7],
          onGround: item[8],
          velocity: item[9],
          trueTrack: item[10],
          vertical_rate: item[11],
          sensors: item[12],
          geoAltitude: item[13],
          squawk: item[14],
          spi: item[15],
          positionSource: item[16],
        };
        this.flights.push(obj);
      });
    },
    focusOnFlight() {
      // TODO axios to get the flight by aircraft from api
    },
    popupMessage(flight) {
      return `
        Callsign: ${flight.callSign}
        Velocity: ${flight.velocity}
        Altitude: ${flight.baroAltitude}
        Origin: ${flight.originCountry}
      `;
    },
  },
  async mounted() {
    try {
      const flightData = await FlightService.getAll();
      this.mapFlightState(flightData);
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
