<template>
  <div class="home">
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
  </div>
</template>

<script>
import FlightService from '../services/flights.service';
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';
import { LIcon } from 'vue2-leaflet';

export default {
  name: 'all',
  components: {
    LIcon,
    'l-rotated-marker': Vue2LeafletRotatedMarker,
  },
  data() {
    return {
      flights: [],
    };
  },
  methods: {
    mapFlightState(flightData) {
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
      this.mapFlightState(flightData);
    } catch (error) {
      // TODO: implement message plugin
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
};
</script>
