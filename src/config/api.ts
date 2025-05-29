import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true // This is important for CORS requests with credentials
});

// Add request interceptor to handle auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Ensure headers are properly set for each request
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (401)
        if(error.response && error.response.status === 401){
            // Redirect to login page if token is invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;