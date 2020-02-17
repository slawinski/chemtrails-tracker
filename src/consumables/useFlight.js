import { ref, onMounted } from '@vue/composition-api';
import { getAll } from '../services/flights.service';

export function useFlights() {
  const isSpinnerVisible = ref(true);
  const flights = ref([]);

  onMounted(() => {
    getFlights();
  });

  async function getFlights() {
    let rawFlightsData = [];
    try {
      rawFlightsData = await getAll();
    } catch (error) {
      // notification('flights');
    } finally {
      mapFlightsData(rawFlightsData);
      isSpinnerVisible.value = false;
    }
  }

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
