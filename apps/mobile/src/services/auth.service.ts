import { supabase } from '../config/supabase';

export const AuthService = {
    // Phone Auth Step 1: Send OTP
    signInWithPhoneNumber: async (phoneNumber: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Phone Auth Error:', error);
            throw error;
        }
    },

    // Phone Auth Step 2: Verify OTP
    confirmCode: async (phoneNumber: string, code: string) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token: code,
                type: 'sms',
            });
            if (error) throw error;
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('OTP Verification Error:', error);
            throw error;
        }
    },

    // Email/Password Login (Alternative)
    login: async (email: string, pass: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: pass,
            });
            if (error) throw error;
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    // Sign Out
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get Current User
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },
};
