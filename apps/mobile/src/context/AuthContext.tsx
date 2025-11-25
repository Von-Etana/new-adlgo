import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/auth.service';
import { ActivityIndicator, View } from 'react-native';
import { User } from '../types';
import { logger } from '../utils/logger';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (phone: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const user = await AuthService.getUser();
            setUser(user);
        } catch (e) {
            logger.error('Error checking user:', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (phone: string, password?: string) => {
        const { user } = await AuthService.login(phone, password);
        setUser(user);
    };

    const register = async (data: any) => {
        await AuthService.register(data);
        // Auto login after register? Or redirect to login.
        // For now, let's just return and let UI handle it.
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
