<template>
  <div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
      <span v-if="!isMarkerClicked">
        <l-rotated-marker
          v-for="flight in allFlights"
          :key="`marker-${flight.icao24}`"
          :lat-lng="flight.position"
          :rotationAngle="flight.trueTrack"
          @click="focusOnFlight(flight)"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="asdf" />
          </l-icon>
        </l-rotated-marker>
      </span>
      <span v-else>
        <l-rotated-marker
          :lat-lng.sync="oneFlight.position"
          :rotationAngle.sync="oneFlight.trueTrack"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="asdf" />
          </l-icon>
          <l-popup :content="popupMessage(oneFlight)"></l-popup>
        </l-rotated-marker>
      </span>
    </l-map>
    <Spinner v-if="!(allFlights.length > 0)" />
  </div>
</template>

<script>
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker';

import FlightsService from '../services/flights.service';
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
      allFlights: [],
      oneFlight: [],
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
          lastContact: item[4],
          position: {
            lat: item[6],
            lng: item[5],
          },
          baroAltitude: item[7],
          onGround: item[8],
          velocity: item[9],
          trueTrack: item[10],
          verticalRate: item[11],
          sensors: item[12],
          geoAltitude: item[13],
          squawk: item[14],
          spi: item[15],
          positionSource: item[16],
        };
        this.allFlights.push(obj);
      });
    },
    async focusOnFlight(flight) {
      this.isMarkerClicked = true;
      try {
        const flightData = await FlightsService.showFlight(
          flight.icao24,
          Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30,
          Math.floor(Date.now() / 1000),
        );
        this.oneFlight = flightData.data[0];
        this.oneFlight.position = flight.position;
        this.oneFlight.trueTrack = flight.trueTrack;
      } catch (error) {
        // TODO: implement message plugin
        // eslint-disable-next-line no-console
        console.error(error);
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
  // TODO this one should be a .then
  async mounted() {
    try {
      const flightData = await FlightsService.getAll();
      this.mapFlightState(flightData);
    } catch (error) {
      // TODO: implement message plugin
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
};
</script>
