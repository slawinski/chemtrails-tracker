import { onMounted, ref } from '@vue/composition-api';
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
      console.error(error);
    } finally {
      mapFlightsData(rawFlightsData);
      isSpinnerVisible.value = false;
    }
  }

  function mapFlightsData(flightData) {
    flights.value = [
      ...flightData.data.states.map(item => {
        const [icao24, callSign, , , , lng, lat, , , , trueTrack] = item;
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
  }
  return { isSpinnerVisible, flights };
}
