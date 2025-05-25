import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
  
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};

// Receipts API
export const receiptsAPI = {
  create: async (receiptData) => {
    const response = await api.post('/receipts', receiptData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/receipts');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/receipts/${id}`);
    return response.data;
  },
  
  update: async (id, receiptData) => {
    const response = await api.put(`/receipts/${id}`, receiptData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/receipts/${id}`);
    return response.data;
  },
  
  downloadPDF: async (id) => {
    const response = await api.get(`/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api; 