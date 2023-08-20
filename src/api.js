
import axios from 'axios';


const backendPort = 5000; // Replace this with your actual backend port

const api = axios.create({
  baseURL: `https://inventorbackend.onrender.com`,
  /* http://localhost:${backendPort} */
});

export default api;
