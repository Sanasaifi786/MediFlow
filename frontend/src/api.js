import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mediflow-8qei.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
