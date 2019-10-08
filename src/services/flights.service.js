import axios from 'axios';

const API = {
  GET_ALL:
    'https://opensky-network.org/api/states/all?lamin=49&lomin=15&lamax=55&lomax=25',
};

async function getAll() {
  return await axios.get(API.GET_ALL);
}

export default {
  getAll,
};
