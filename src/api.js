
import axios from 'axios';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const backendPort = 5000; // Replace this with your actual backend port

const api = axios.create({
  baseURL: `http://localhost:${serverUrl}`,
});

export default api;
