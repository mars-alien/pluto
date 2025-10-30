import axios from 'axios';

const BACKEND_API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BACKEND_API_BASE, // backend base URl http://localhost:5000/api
});

export default API;
