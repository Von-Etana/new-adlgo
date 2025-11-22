import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Dimensions,
    Alert,
} from 'react-native';
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TrackingScreen = ({ route }: any) => {
    const navigation = useNavigation<any>();
    const { driver } = route.params || { driver: { name: 'Musa Driver', vehicle: 'Toyota Camry', rating: 4.8, id: 'driver_456' } };
    const mapRef = useRef<MapView>(null);
    const [driverLocation, setDriverLocation] = useState({
        latitude: 9.0765, // Abuja Default
        longitude: 7.3986,
    });
    const [eta, setEta] = useState('10 mins');
    const [status, setStatus] = useState('Driver is on the way');

    // Mock Order ID
    const ORDER_ID = 'order_123';
    const DRIVER_ID = driver.id;

    useEffect(() => {
        // Listen to Driver Location from Supabase
        const driverChannel = supabase
            .channel(`driver-location-${DRIVER_ID}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'drivers', filter: `id=eq.${DRIVER_ID}` },
                (payload) => {
                    const data = payload.new;
                    if (data && data.latitude && data.longitude) {
                        setDriverLocation({
                            latitude: data.latitude,
                            longitude: data.longitude,
                        });

                        // Animate Map to new location
                        mapRef.current?.animateCamera({
                            center: {
                                latitude: data.latitude,
                                longitude: data.longitude,
                            },
                            zoom: 15,
                        });
                    }
                }
            )
            .subscribe();

        // Listen to Order Status
        const orderChannel = supabase
            .channel(`order-status-${ORDER_ID}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${ORDER_ID}` },
                (payload) => {
                    const newStatus = payload.new.status;
                    if (newStatus) setStatus(newStatus);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(driverChannel);
            supabase.removeChannel(orderChannel);
        };
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 9.0765,
                    longitude: 7.3986,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Driver Marker */}
                <Marker
                    coordinate={driverLocation}
                    title="Your Driver"
                    description={eta}
                >
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3097/3097136.png' }}
                        style={{ width: 40, height: 40 }}
                    />
                </Marker>
            </MapView>

            {/* Top Status Bar */}
            <SafeAreaView style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </SafeAreaView>

            {/* Bottom Sheet Info */}
            <View style={styles.bottomSheet}>
                <View style={styles.driverRow}>
                    <View style={styles.driverProfile}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{driver.name[0]}</Text>
                        </View>
                        <View>
                            <Text style={styles.driverName}>{driver.name}</Text>
                            <Text style={styles.vehicleInfo}>{driver.vehicle} • ★ {driver.rating}</Text>
                        </View>
                    </View>
                    <View style={styles.plateContainer}>
                        <Text style={styles.plateText}>ABC-123</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Chat', { driverId: driver.id })}
                    >
                        <MessageSquare size={24} color="#1A1A1A" />
                        <Text style={styles.actionLabel}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Calling Driver...')}
                    >
                        <Phone size={24} color="#1A1A1A" />
                        <Text style={styles.actionLabel}>Call</Text>
                    </TouchableOpacity>
                    <View style={styles.otpContainer}>
                        <Text style={styles.otpLabel}>OTP Code</Text>
                        <Text style={styles.otpCode}>4492</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    topBar: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusPill: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    driverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    driverProfile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    vehicleInfo: {
        color: '#666',
        fontSize: 14,
    },
    plateContainer: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    plateText: {
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    actionLabel: {
        fontSize: 12,
        color: '#666',
    },
    otpContainer: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    otpLabel: {
        fontSize: 10,
        color: '#1976D2',
        fontWeight: '600',
    },
    otpCode: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1976D2',
    },
});

export default TrackingScreen;
