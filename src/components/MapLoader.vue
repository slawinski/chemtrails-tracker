<template>
  <div>
    <l-map :zoom="zoom" :center="center">
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
          :lat-lng="singleFlight.position"
          :rotationAngle="singleFlight.trueTrack"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="airplane" />
          </l-icon>
          <l-popup :content="popupMessage(singleFlight)"></l-popup>
        </l-rotated-marker>
      </span>
    </l-map>
    <Spinner v-if="isSpinnerVisible" />
  </div>
</template>

<script>
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';

import FlightsService from '../services/flights.service';
import { mapFlightState } from '../utils/map';
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
      isMarkerClicked: false,
      zoom: 6,
      center: latLng(52, 19),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      flights: [],
      singleFlight: [],
      isSpinnerVisible: true,
    };
  },
  methods: {
    async focusOnFlight(flight) {
      this.isSpinnerVisible = true;
      try {
        const rawFlightData = await FlightsService.showFlight(
          flight.icao24,
          Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30,
          Math.floor(Date.now() / 1000),
        );
        this.singleFlight = rawFlightData.data[0];
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
      const rawFlightData = await FlightsService.getAll();
      this.flights = mapFlightState(rawFlightData);
    } catch (error) {
      // TODO: implement message plugin
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.isSpinnerVisible = false;
    }
  },
};
</script>
