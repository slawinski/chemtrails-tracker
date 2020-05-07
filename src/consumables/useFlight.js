import { onMounted, ref } from '@vue/composition-api';
import { getAll } from '../services/flight.service';

export function useFlights() {
  const flights = ref([]);

  onMounted(() => {
    getFlights();
  });

  async function getFlights() {
    let rawFlightData = [];
    try {
      rawFlightData = await getAll();
    } catch (error) {
      console.error(error);
    } finally {
      mapFlightData(rawFlightData);
    }
  }

  function mapFlightData(flightData) {
    flights.value = [
      ...flightData.data
        .map(item => {
          const { Latitude, Longitude, Altitude } = item;
          return [Latitude, Longitude, Altitude];
        })
        .filter(item => {
          if (item[0] + item[1] + item[2] !== 0) {
            return item;
          }
        }),
    ];
    console.table(flights.value);
  }

  return { flights };
}
