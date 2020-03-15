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
      zoom: 6, // Map config
      center: latLng(52, 19), // Map config
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // Map config
      flights: [], // Get all flights
      isSpinnerVisible: false, // Get all flights
      isMarkerClicked: false, // Show one flight
      singleFlight: {
        aircraft: null,
        route: null,
        trackingData: null,
      }, // Show one flight
      heatmapArray: [], // Show one flight
    };
  },

  computed: {
    popupData() {
      let popupText = '';
      const { aircraft, route } = this.singleFlight;
      if (aircraft && route) {
        popupText = `Airlines: ${aircraft.owner} <br/>
          Aircraft: ${aircraft.model} <br/>
          Route: ${route.departure} - ${route.arrival}`;
      } else if (aircraft && !route) {
        popupText = `Aircraft: ${aircraft.model} <br/>
          Route: no data`;
      } else if (!aircraft && route) {
        popupText = `Airline: no data <br/>
          Aircraft: no data <br/>
          Route: ${route.departure} - ${route.arrival}`;
      } else if (!aircraft && !route) {
        popupText = `No data`;
      }
      return popupText;
    }, // Popup
  },

  methods: {
    async getFlights() {
      this.isSpinnerVisible = true;
      let rawFlightsData = [];
      try {
        rawFlightsData = await getAll();
      } catch (error) {
        console.error(error);
      } finally {
        this.mapFlightsData(rawFlightsData);
        this.isSpinnerVisible = false;
      }
    }, // Get all flights

    mapFlightsData(flightData) {
      this.flights = [
        ...flightData.data.states.map(item => {
          const {
            0: icao24,
            1: callSign,
            5: lng,
            6: lat,
            10: trueTrack,
          } = item;
          return {
            icao24,
            callSign,
            position: {
              lat,
              lng,
            },
            trueTrack,
          };
        }),
      ];
    }, // Get all flights

    async focusOnFlight(flight) {
      this.isMarkerClicked = true;
      this.singleFlight.trackingData = flight;
      this.$refs.map.mapObject.setView(flight.position, 8);
      this.getRoute(flight);
      this.getAircraft(flight);
      this.createHeatMap(flight.position, flight.trueTrack);
    }, // Show one flight

    async getAircraft(flight) {
      let rawAircraftData = {};
      try {
        rawAircraftData = await showAircraft(flight.icao24);
      } catch (error) {
        console.error(error);
      } finally {
        this.singleFlight.aircraft = rawAircraftData.data;
      }
    }, // Show one flight

    async getRoute(flight) {
      let rawRouteData = {};
      try {
        rawRouteData = await showRoute(flight.callSign);
      } catch (error) {
        console.error(error);
      } finally {
        this.mapRouteData(rawRouteData.data);
      }
    }, // Show one flight

    async mapRouteData(routeData) {
      const [rawDeparture, rawArrival] = routeData.route;
      return (this.singleFlight.route = {
        departure: await this.translateIcao(rawDeparture),
        arrival: await this.translateIcao(rawArrival),
      });
    }, // Show one flight

    async translateIcao(icao) {
      let obj = {};
      try {
        obj = await showAirport(icao);
        const { municipality, country } = obj.data;
        return `${municipality}, ${country}`;
      } catch (error) {
        console.error(error);
      }
    }, // Show one flight

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
    }, // Show one flight

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
    }, // Show one flight

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
    }, // Show one flight

    toRadians(angle) {
      return angle * (Math.PI / 180);
    }, // Show one flight

    goBack() {
      this.isMarkerClicked = false;
      this.singleFlight = {
        aircraft: null,
        route: null,
        trackingData: null,
      };
      this.$refs.map.mapObject.setView(this.center, 6);
    }, // Show one flight
  },

  mounted() {
    this.getFlights();
  }, // Get all flights
};
</script>

<style>
.spinner {
  z-index: 9999;
}
</style>
