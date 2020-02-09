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
import {
  getAll,
  showRoute,
  showAircraft,
  showAirport,
} from '../services/flights.service';
import Spinner from '../components/Spinner';
import { LControl, LIcon, LMap, LTileLayer, LPopup } from 'vue2-leaflet';
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
    LPopup,
    'l-rotated-marker': Vue2LeafletRotatedMarker,
  },

  data() {
    return {
      zoom: 6, // Map configuration
      center: latLng(52, 19), // Map configuration
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // Map configuration
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', // Map configuration
      isMarkerClicked: false,
      flights: [], // Processing all flights
      isSpinnerVisible: false, // Processing all flights
      singleFlight: {
        aircraft: null,
        route: null,
        trackingData: null,
      }, // Processing one flight
      heatmapArray: [], // Processing one flight
    };
  },

  computed: {
    popupData() {
      let text = '';
      if (this.singleFlight.aircraft && this.singleFlight.route) {
        text = `Aircraft: ${this.singleFlight.aircraft.model} <br/>
          Route: ${this.singleFlight.route.departure} - ${this.singleFlight.route.arrival}`;
      } else if (this.singleFlight.aircraft && !this.singleFlight.route) {
        text = `Aircraft: ${this.singleFlight.aircraft.model} <br/>
          Route: no data`;
      } else if (!this.singleFlight.aircraft && this.singleFlight.route) {
        text = `Aircraft: no data <br/>
          Route: ${this.singleFlight.route.departure} - ${this.singleFlight.route.arrival}`;
      } else if (!this.singleFlight.aircraft && !this.singleFlight.route) {
        text = `No data`;
      }
      return text;
    }, // Notification service
  },

  methods: {
    async getFlights() {
      this.isSpinnerVisible = true;
      let rawFlightsData = [];
      try {
        rawFlightsData = await getAll();
      } catch (error) {
        this.notification('flights');
      } finally {
        this.mapFlightsData(rawFlightsData);
        this.isSpinnerVisible = false;
      }
    }, // Processing all flights

    mapFlightsData(flightData) {
      flightData.data.states.map(item => {
        const obj = {
          icao24: item[0],
          callSign: item[1],
          position: {
            lat: item[6],
            lng: item[5],
          },
          trueTrack: item[10],
        };
        this.flights.push(obj);
      });
    }, // Processing all flights

    async focusOnFlight(flight) {
      this.isMarkerClicked = true;
      this.singleFlight.trackingData = flight;
      this.$refs.map.mapObject.setView(flight.position, 8);
      this.createHeatMap(flight.position, flight.trueTrack);
      this.getRoute(flight);
      this.getAircraft(flight);
    }, // Processing one flight

    async getAircraft(flight) {
      let rawAircraftData = {};
      try {
        rawAircraftData = await showAircraft(flight.icao24);
      } catch (error) {
        this.notification('aircraft');
      } finally {
        this.singleFlight.aircraft = rawAircraftData.data;
      }
    }, // Processing one flight

    async getRoute(flight) {
      let rawRouteData = {};
      try {
        rawRouteData = await showRoute(flight.callSign);
      } catch (error) {
        this.notification('route');
      } finally {
        this.mapRouteData(rawRouteData.data);
      }
    }, // Processing one flight

    async mapRouteData(routeData) {
      return (this.singleFlight.route = {
        departure: await this.translateIcao(routeData.route[0]),
        arrival: await this.translateIcao(routeData.route[1]),
      });
    }, // Processing one flight

    async translateIcao(icao) {
      let obj = {};
      try {
        obj = await showAirport(icao);
        return `${obj.data.municipality}, ${obj.data.country}`;
      } catch (error) {
        this.notification('airport');
      }
    }, // Processing one flight

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
    }, // Processing one flight

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
    }, // Processing one flight

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
    }, // Processing one flight

    toRadians(angle) {
      return angle * (Math.PI / 180);
    }, // Processing one flight

    notification(message) {
      this.$notify({
        group: 'api',
        type: 'error',
        title: 'ERROR',
        text: `An error has occurred while fetching ${message} data`,
      });
    }, // Notification service

    goBack() {
      this.isMarkerClicked = false;
      this.singleFlight = {
        aircraft: null,
        route: null,
        trackingData: null,
      };
      this.$refs.map.mapObject.setView(this.center, 6);
    }, // Processing one flight
  },

  mounted() {
    this.getFlights(); // Processing all flights
  },
};
</script>

<style>
.spinner {
  z-index: 9999;
}
</style>
