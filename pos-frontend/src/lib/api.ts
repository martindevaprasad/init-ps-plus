import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pos_token');
  const tenantId = localStorage.getItem('pos_tenant');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
