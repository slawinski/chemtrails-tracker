import axios from 'axios';
import API from '../constants/api';

async function getAll() {
  return await axios.get(API.GET_ALL);
}

export default {
  getAll,
};
