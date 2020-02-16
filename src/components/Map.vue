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
  setup() {
    const { zoom, center, url } = useMapConfig();
    const { isSpinnerVisible, flights } = useFlights();
    const {
      popupData,
      isMarkerClicked,
      singleFlight,
      focusOnFlight,
      heatmapArray,
      goBack,
      map,
    } = useFocusOnFlight(center);
    return {
      zoom,
      center,
      url,
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
};

function useMapConfig() {
  const zoom = ref(6);
  const center = ref(latLng(52, 19));
  const url = ref('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
  return {
    zoom,
    center,
    url,
  };
}

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
      const [icao24, callSign, , , , lng, lat, , , , trueTrack] = item;
      const obj = {
        icao24,
        callSign,
        position: {
          lat,
          lng,
        },
        trueTrack,
      };
      // TODO spread operator
      flights.value.push(obj);
    });
  }
  return { isSpinnerVisible, flights };
}

function useFocusOnFlight(center) {
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
    // TODO object destructuring
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
    map.value.mapObject.setView(flight.position, 8);
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
    const [rawDeparture, rawArrival] = routeData.route;
    return (singleFlight.route = {
      departure: await translateIcao(rawDeparture),
      arrival: await translateIcao(rawArrival),
    });
  }

  async function translateIcao(icao) {
    let obj = {};
    try {
      obj = await showAirport(icao);
      const { municipality, country } = obj.data;
      return `${municipality}, ${country}`;
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
    map.value.mapObject.setView(center.value, 6);
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
