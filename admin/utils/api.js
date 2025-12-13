import axios from "axios";

const BASE_URL = 'http://localhost:5000/api';

export const useApi = () => {
    const apiClient = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    apiClient.interceptors.request.use(async (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    apiClient.interceptors.response.use(
        (response) => response.data, // return only pure data
        (error) => Promise.reject(error)
    );

    return apiClient;
}
