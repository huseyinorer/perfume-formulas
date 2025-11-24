import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL, STORAGE_KEYS } from '@/utils/constants';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies
});

// Request interceptor - add token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            // Dispatch custom event for logout
            window.dispatchEvent(new Event('auth:logout'));
        }

        // Handle other errors
        if (error.response?.status === 403) {
            console.error('Forbidden: You don\'t have permission to access this resource');
        }

        if (error.response?.status === 500) {
            console.error('Server error: Please try again later');
        }

        return Promise.reject(error);
    }
);

export default api;
