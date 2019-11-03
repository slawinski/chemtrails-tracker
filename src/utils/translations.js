import { showAirport } from '../services/flights.service';

export async function translateIcao(icao) {
  let obj = {};
  try {
    obj = await showAirport(icao);
    return `${obj.data.municipality}, ${obj.data.country}`;
  } catch (error) {
    // TODO: implement message plugin
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
