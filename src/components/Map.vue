<template>
  <div>
    <l-map ref="map" :zoom.sync="zoom" :center="center">
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
        <LeafletHeatmap :lat-lng="heatmapArray" />
        <l-rotated-marker
          :lat-lng="singleFlight.trackingData.position"
          :rotationAngle="singleFlight.trackingData.trueTrack"
        >
          <l-icon>
            <img src="../../src/assets/airplane.svg" alt="airplane" />
          </l-icon>
        </l-rotated-marker>
        <l-control position="bottomleft">
          <button @click="goBack()">
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
import {
  getAll,
  showRoute,
  showAircraft,
  showAirport,
} from '../services/flights.service';
import Spinner from '../components/Spinner';
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
      singleFlight: {},
      isSpinnerVisible: false,
      heatmapArray: [],
    };
  },
  methods: {
    mapFlightsData(flightData) {
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
        this.flights.push(obj);
      });
    },
    async mapRouteData(routeData) {
      this.singleFlight.route = {
        callsign: routeData.callsign,
        route: {
          departure: await this.translateIcao(routeData.route[0]),
          arrival: await this.translateIcao(routeData.route[1]),
        },
        updateTime: routeData.updateTime,
        operatorIata: routeData.operatorIata,
        flightNumber: routeData.flightNumber,
      };
    },
    async translateIcao(icao) {
      let obj = {};
      try {
        obj = await showAirport(icao);
        return `${obj.data.municipality}, ${obj.data.country}`;
      } catch (error) {
        // TODO: implement message plugin
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    createHeatMap(position, trueTrack) {
      const iterations = 100;
      const distance = 20 / iterations;

      return (this.heatmapArray = Array(iterations)
        .fill()
        .map((e, i) => {
          return [
            position.lat + this.getLat((distance * i) / 10, trueTrack),
            position.lng + this.getLng((distance * i) / 10, trueTrack),
            iterations - i,
          ];
        }));
    },
    getLat(dist, trueTrack) {
      if (trueTrack > 270 || trueTrack <= 90) {
        return -Math.sqrt(
          dist ** 2 * (1 - Math.sin(this.toRadians(trueTrack)) ** 2),
        );
      } else {
        return Math.sqrt(
          dist ** 2 * (1 - Math.sin(this.toRadians(trueTrack)) ** 2),
        );
      }
    },
    getLng(dist, trueTrack) {
      if (trueTrack > 0 && trueTrack <= 180) {
        return -Math.sqrt(
          dist ** 2 * (1 - Math.cos(this.toRadians(trueTrack)) ** 2),
        );
      } else {
        return Math.sqrt(
          dist ** 2 * (1 - Math.cos(this.toRadians(trueTrack)) ** 2),
        );
      }
    },
    toRadians(angle) {
      return angle * (Math.PI / 180);
    },
    async getFlights() {
      this.isSpinnerVisible = true;
      let rawFlightsData = [];
      try {
        rawFlightsData = await getAll();
      } catch (error) {
        // TODO: implement message plugin
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.mapFlightsData(rawFlightsData);
        this.isSpinnerVisible = false;
      }
    },
    async getRoute(flight) {
      let rawRouteData = {};
      try {
        rawRouteData = await showRoute(flight.callSign);
      } catch (error) {
        // TODO: implement message plugin
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.mapRouteData(rawRouteData.data);
      }
    },
    async getAircraft(flight) {
      let rawAircraftData = {};
      try {
        rawAircraftData = await showAircraft(flight.icao24);
      } catch (error) {
        // TODO: implement message plugin
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.singleFlight.aircraft = rawAircraftData.data;
      }
    },
    async focusOnFlight(flight) {
      this.isMarkerClicked = true;
      this.singleFlight.trackingData = flight;
      this.$refs.map.mapObject.setView(flight.position, 8);
      this.createHeatMap(flight.position, flight.trueTrack);
      this.getRoute(flight);
      this.getAircraft(flight);
    },
    goBack() {
      this.isMarkerClicked = false;
      this.$refs.map.mapObject.setView(this.center, 6);
    },
  },
  mounted() {
    // TODO make a call to method here
    this.getFlights();
  },
};
</script>

<style>
.spinner {
  z-index: 9999;
}
</style>
