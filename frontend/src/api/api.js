import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const BACKEND_API_BASE = API_BASE_URL;

const API = axios.create({
  baseURL: BACKEND_API_BASE, // backend base URl http://localhost:5000/api
});

export default API;
