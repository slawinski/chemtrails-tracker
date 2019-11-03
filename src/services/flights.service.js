import axios from 'axios';

const API = {
  // TODO use local variables for ajax and backend URLs
  GET_ALL:
    'https://opensky-network.org/api/states/all?lamin=49&lomin=15&lamax=55&lomax=25',
  SHOW_ROUTE: 'http://localhost:8080/api/routes',
};

async function getAll() {
  return await axios.get(API.GET_ALL);
}

// TODO url generator with query parameters
async function showRoute(callSign) {
  return await axios.get(`${API.SHOW_ROUTE}?callsign=${callSign}`);
}

export default {
  getAll,
  showRoute,
};
