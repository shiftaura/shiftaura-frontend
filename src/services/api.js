import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the JWT token to every protected request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('team_hub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('team_hub_token');
      // Redirect to login if unauthorized, avoiding full page reloads if possible
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;