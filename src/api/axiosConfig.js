// src/api/axiosConfig.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'https://localhost:7001/api/', // Adjust this as needed for your primary backend service
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor (optional, but good practice)
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized errors, e.g., redirect to login
            // localStorage.removeItem('jwtToken');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient; // <--- ENSURE THIS LINE IS EXACTLY LIKE THIS