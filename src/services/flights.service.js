import axios from 'axios';

const API = {
  // TODO use local variables for ajax and backend URLs
  GET_ALL:
    'https://opensky-network.org/api/states/all?lamin=49&lomin=15&lamax=55&lomax=25',
  SHOW_ROUTE: `${process.env.VUE_APP_DEV_SERVER}/api/routes`,
};

async function getAll() {
  return await axios.get(API.GET_ALL);
}

/**
 * Axios URL had to be directed via proxy dev server to avoid problems with cors as in
 * https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3
 */
async function showRoute(callSign) {
  return await axios.get(`${API.SHOW_ROUTE}?callsign=${callSign}`);
}

export default {
  getAll,
  showRoute,
};
