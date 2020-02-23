import { ref, reactive, computed } from '@vue/composition-api';
import {
  showRoute,
  showAircraft,
  showAirport,
} from '../services/flights.service';

export function useFocusOnFlight(center) {
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
    const { aircraft, route } = singleFlight;
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
      console.error(error);
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
      console.error(error);
    }
  }

  async function getAircraft(flight) {
    let rawAircraftData = {};
    try {
      rawAircraftData = await showAircraft(flight.icao24);
    } catch (error) {
      console.error(error);
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
