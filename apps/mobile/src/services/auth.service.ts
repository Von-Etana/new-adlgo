import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
    login: async (phone: string, password?: string) => {
        const response = await api.post('/auth/login', { phone, password });
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        return { token, user };
    },

    register: async (data: { phone: string; password?: string; fullName?: string; role?: string }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    },

    getUser: async () => {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
