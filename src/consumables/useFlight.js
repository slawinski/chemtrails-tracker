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
        const { 0: icao24, 1: callSign, 5: lng, 6: lat, 10: trueTrack } = item;
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
