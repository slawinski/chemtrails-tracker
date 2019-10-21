import axios from 'axios';

const API = {
  GET_ALL:
    'https://opensky-network.org/api/states/all?lamin=49&lomin=15&lamax=55&lomax=25',
};

async function getAll() {
  return await axios.get(API.GET_ALL);
}

// TODO url generator with query parameters
async function showFlight(icao, begin, end) {
  return await axios.get(
    `https://${process.env.VUE_APP_OPENSKY_USER}:${process.env.VUE_APP_OPENSKY_PASSWORD}@opensky-network.org/api/flights/aircraft?icao24=${icao}&begin=${begin}&end=${end}`,
  );
}

export default {
  getAll,
  showFlight,
};
