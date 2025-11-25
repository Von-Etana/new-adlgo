import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for Auth Token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            logger.error('Error retrieving token:', error);
            // Proceed without token or handle error as needed
        }
        return config;
    },
    (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (!config || !config.retry) {
            return Promise.reject(error);
        }

        config.retry -= 1;
        if (config.retry === 0) {
            return Promise.reject(error);
        }

        const delayRetryRequest = new Promise<void>((resolve) => {
            setTimeout(() => {
                // Commented out for production
                // logger.debug('Retrying request', config.url);
                resolve();
            }, config.retryDelay || 1000);
        });

        return delayRetryRequest.then(() => api(config));
    }
);

export default api;
