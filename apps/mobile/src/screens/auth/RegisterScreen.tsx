import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }: any) => {
    const { register, login } = useAuth();
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!phone || !fullName) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        setLoading(true);
        try {
            await register({ phone, fullName, password });
            Alert.alert('Success', 'Account created!', [
                { text: 'OK', onPress: () => login(phone, password) }
            ]);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ADLgo today</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    value={fullName}
                    onChangeText={setFullName}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+234..."
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkButton}>
                    <Text style={styles.linkText}>Already have an account? Login</Text>
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

export default RegisterScreen;
