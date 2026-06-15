import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/orders';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createOrder = (orderData) => api.post('', orderData);
export const getOrders = () => api.get('');
export const getOrderById = (id) => api.get(`/${id}`);

export default api;
