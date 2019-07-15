import axios from 'axios';
import API from '../constants/api';

export default {
  async getAll() {
    return await axios.get(API.GET_ALL)
  }
}
