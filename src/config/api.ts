import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

console.log("API_URL", API_URL);

const api = axios.create({
    // Base URL should be relative since we're using Vite's proxy
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true // Important for CORS requests with credentials
});

// Add request interceptor to handle auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle unauthorized errors (401)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error);
            throw new Error('Network error occurred. Please check your connection.');
        }

        // Handle other API errors
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        throw new Error(errorMessage);
    }
);

export default api;