import axios from 'axios';
import API from '../constants/api';

export async function getAll() {
  return await axios.get(API.GET_ALL)
}
