import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { validatePhone, formatPhone } from '../../utils/validation';

const LoginScreen = ({ navigation }: any) => {
    const { login } = useAuth();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Validate phone number
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.isValid) {
            Alert.alert('Invalid Phone Number', phoneValidation.error);
            return;
        }

        setLoading(true);
        try {
            // Format phone number before sending
            const formattedPhone = formatPhone(phone);
            await login(formattedPhone, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+234..."
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password (Optional for prototype)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
                    <Text style={styles.linkText}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 48,
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    button: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    linkText: {
        color: '#1A1A1A',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default LoginScreen;
