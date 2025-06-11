// src/api/axios.ts (or axios.js)
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://eventmanagement-backend-u4yf.onrender.com/api' ||'http://localhost:3000/api', // Adjust your backend URL as needed
  // You might need to add other default headers here if necessary
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (useful for handling token expiry or errors)
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     // Example: Handle 401 Unauthorized for token refresh or re-login
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // Here you could try to refresh the token, or redirect to login
//       // For simplicity, we'll just redirect to login
//       localStorage.removeItem('token');
//       // window.location.href = '/login'; // Or use react-router's navigate
//       // toast.error("Session expired. Please log in again.");
//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   }
// );

export default API;