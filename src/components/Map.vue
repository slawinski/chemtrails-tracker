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
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
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
  setup() {
    const { isSpinnerVisible, flights } = useFlights();
    const {
      popupData,
      isMarkerClicked,
      singleFlight,
      focusOnFlight,
      heatmapArray,
      goBack,
      map,
    } = useFocusOnFlight();
    return {
      isSpinnerVisible,
      flights,
      popupData,
      isMarkerClicked,
      singleFlight,
      focusOnFlight,
      heatmapArray,
      goBack,
      map,
    };
  },
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
      zoom: 6,
      center: latLng(52, 19),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
};

function useFlights() {
  const isSpinnerVisible = ref(true);
  const flights = ref([]);

  onMounted(async () => {
    let rawFlightsData = [];
    try {
      rawFlightsData = await getAll();
    } catch (error) {
      // notification('flights');
    } finally {
      mapFlightsData(rawFlightsData);
      isSpinnerVisible.value = false;
    }
  });

  function mapFlightsData(flightData) {
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
      flights.value.push(obj);
    });
  }
  return { isSpinnerVisible, flights };
}

function useFocusOnFlight() {
  const isMarkerClicked = ref(false);
  const singleFlight = reactive({
    aircraft: null,
    route: null,
    trackingData: null,
  });
  const heatmapArray = ref([]);
  const map = ref(null);

  const popupData = computed(() => {
    let popupText = '';
    if (singleFlight.aircraft && singleFlight.route) {
      popupText = `Aircraft: ${singleFlight.aircraft.model} <br/>
          Route: ${singleFlight.route.departure} - ${singleFlight.route.arrival}`;
    } else if (singleFlight.aircraft && !singleFlight.route) {
      popupText = `Aircraft: ${singleFlight.aircraft.model} <br/>
          Route: no data`;
    } else if (!singleFlight.aircraft && singleFlight.route) {
      popupText = `Aircraft: no data <br/>
          Route: ${singleFlight.route.departure} - ${singleFlight.route.arrival}`;
    } else if (!singleFlight.aircraft && !singleFlight.route) {
      popupText = `No data`;
    }
    return popupText;
  });

  async function focusOnFlight(flight) {
    isMarkerClicked.value = true;
    singleFlight.trackingData = flight;
    this.$refs.map.mapObject.setView(flight.position, 8);
    getRoute(flight);
    getAircraft(flight);
    createHeatMap(flight.position, flight.trueTrack);
  }

  async function getRoute(flight) {
    let rawRouteData = {};
    try {
      rawRouteData = await showRoute(flight.callSign);
    } catch (error) {
      // notification('route');
    } finally {
      mapRouteData(rawRouteData.data);
    }
  }

  async function mapRouteData(routeData) {
    return (singleFlight.route = {
      departure: await translateIcao(routeData.route[0]),
      arrival: await translateIcao(routeData.route[1]),
    });
  }

  async function translateIcao(icao) {
    let obj = {};
    try {
      obj = await showAirport(icao);
      return `${obj.data.municipality}, ${obj.data.country}`;
    } catch (error) {
      // notification('airport');
    }
  }

  async function getAircraft(flight) {
    let rawAircraftData = {};
    try {
      rawAircraftData = await showAircraft(flight.icao24);
    } catch (error) {
      // notification('aircraft');
    } finally {
      singleFlight.aircraft = rawAircraftData.data;
    }
  }

  function createHeatMap(position, trueTrack) {
    const iterations = 100;
    const distance = 20 / iterations;

    return (heatmapArray.value = Array(iterations)
      .fill()
      .map((e, i) => {
        return [
          position.lat + getLat((distance * i) / 10, trueTrack),
          position.lng + getLng((distance * i) / 10, trueTrack),
          iterations - i,
        ];
      }));
  }

  function getLat(dist, trueTrack) {
    const formula = Math.sqrt(
      dist ** 2 * (1 - Math.sin(toRadians(trueTrack)) ** 2),
    );
    return trueTrack > 270 || trueTrack <= 90 ? -formula : formula;
  }

  function getLng(dist, trueTrack) {
    const formula = Math.sqrt(
      dist ** 2 * (1 - Math.cos(toRadians(trueTrack)) ** 2),
    );
    return trueTrack > 0 && trueTrack <= 180 ? -formula : formula;
  }

  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function goBack() {
    isMarkerClicked.value = false;
    singleFlight.aircraft = null;
    singleFlight.route = null;
    singleFlight.trackingData = null;
    map.value.mapObject.setView({ lat: 52, lng: 19 }, 6);
  }

  // function notification(message) {
  //   this.$notify({
  //     group: 'api',
  //     type: 'error',
  //     title: 'ERROR',
  //     text: `An error has occurred while fetching ${message} data`,
  //   });
  // }

  return {
    popupData,
    isMarkerClicked,
    singleFlight,
    focusOnFlight,
    heatmapArray,
    goBack,
    map,
  };
}
</script>

<style>
.spinner {
  z-index: 9999;
}
</style>
