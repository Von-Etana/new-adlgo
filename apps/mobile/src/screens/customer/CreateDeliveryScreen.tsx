import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSocket } from '../../hooks/useSocket';
import { ENV } from '../../config/env';

// Replace with your actual API Key
const GOOGLE_MAPS_API_KEY = ENV.GOOGLE_MAPS_API_KEY;

const CreateDeliveryScreen = ({ navigation }: any) => {
    const socket = useSocket();
    const [pickup, setPickup] = useState<any>(null);
    const [dropoff, setDropoff] = useState<any>(null);
    const [price, setPrice] = useState('');
    const [itemType, setItemType] = useState('Documents');
    const [isSearching, setIsSearching] = useState(false);

    const handleCreateOrder = () => {
        if (!pickup || !dropoff || !price) {
            Alert.alert('Missing Info', 'Please select pickup, dropoff and offer a price.');
            return;
        }

        setIsSearching(true);

        const orderData = {
            userId: 'user_001', // Should come from Auth Context
            pickup: {
                address: pickup.description,
                lat: pickup.location.lat,
                lng: pickup.location.lng,
            },
            dropoff: {
                address: dropoff.description,
                lat: dropoff.location.lat,
                lng: dropoff.location.lng,
            },
            offerPrice: parseInt(price),
            type: itemType,
        };

        // console.log('Creating Order:', orderData);
        socket?.emit('create_order', orderData);

        // Simulate finding driver process
        setTimeout(() => {
            setIsSearching(false);
            navigation.navigate('FindingDriver', { order: orderData });
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Create Delivery</Text>
                    </View>

                    {/* Location Inputs using Google Places */}
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <View style={[styles.dot, styles.greenDot]} />
                            <GooglePlacesAutocomplete
                                placeholder="Pickup Location"
                                onPress={(data: any, details: any = null) => {
                                    setPickup({
                                        description: data.description,
                                        location: details?.geometry.location,
                                    });
                                }}
                                query={{
                                    key: GOOGLE_MAPS_API_KEY,
                                    language: 'en',
                                    components: 'country:ng', // Limit to Nigeria
                                }}
                                fetchDetails={true}
                                styles={{
                                    textInput: styles.placesInput,
                                    listView: { zIndex: 1000 }, // Ensure dropdown shows over other elements
                                }}
                                enablePoweredByContainer={false}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.inputGroup}>
                            <View style={[styles.dot, styles.redDot]} />
                            <GooglePlacesAutocomplete
                                placeholder="Dropoff Location"
                                onPress={(data: any, details: any = null) => {
                                    setDropoff({
                                        description: data.description,
                                        location: details?.geometry.location,
                                    });
                                }}
                                query={{
                                    key: GOOGLE_MAPS_API_KEY,
                                    language: 'en',
                                    components: 'country:ng',
                                }}
                                fetchDetails={true}
                                styles={{
                                    textInput: styles.placesInput,
                                }}
                                enablePoweredByContainer={false}
                            />
                        </View>
                    </View>

                    {/* Item Type Selection */}
                    <Text style={styles.sectionLabel}>What are you sending?</Text>
                    <View style={styles.typeContainer}>
                        {['Documents', 'Electronics', 'Food', 'Clothes'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeChip,
                                    itemType === type && styles.activeTypeChip,
                                ]}
                                onPress={() => setItemType(type)}
                            >
                                <Text
                                    style={[
                                        styles.typeText,
                                        itemType === type && styles.activeTypeText,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Price Offer */}
                    <Text style={styles.sectionLabel}>Offer your price (₦)</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currencySymbol}>₦</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="0"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            isSearching && styles.disabledButton
                        ]}
                        onPress={handleCreateOrder}
                        disabled={isSearching}
                    >
                        <Text style={styles.submitButtonText}>
                            {isSearching ? 'Finding Drivers...' : 'Find Driver'}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 16,
        padding: 8,
    },
    backText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        zIndex: 10, // Important for autocomplete dropdown
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        zIndex: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 24,
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
        marginTop: 15, // Align with text input
    },
    greenDot: {
        backgroundColor: '#4CAF50',
    },
    redDot: {
        backgroundColor: '#F44336',
    },
    placesInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 44,
        fontSize: 14,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        zIndex: 1,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
        zIndex: 1,
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    activeTypeChip: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    typeText: {
        color: '#666',
        fontWeight: '500',
    },
    activeTypeText: {
        color: '#fff',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 60,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        zIndex: 1,
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    priceInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 1,
    },
    disabledButton: {
        backgroundColor: '#999',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreateDeliveryScreen;
