import axios from 'axios';

const API = {
  // TODO use local variables for ajax and backend URLs
  GET_ALL: './zadanie-telemetria.json',
};

export async function getAll() {
  return await axios.get(API.GET_ALL);
}
