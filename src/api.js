
import axios from 'axios';


const backendPort = 5000; // Replace this with your actual backend port

const api = axios.create({
/*   baseURL: `http://localhost:${backendPort}`, */
  baseURL: `https://mybackend-023u.onrender.com`,

});

export default api;
