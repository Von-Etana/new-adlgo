import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Image,
} from 'react-native';
import BiddingModal from '../../components/BiddingModal';
import { useSocket } from '../../hooks/useSocket';

// Mock Map Component (Placeholder)
const MapPlaceholder = () => (
    <View style={styles.mapContainer}>
        <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Open_Street_Map_example.png/640px-Open_Street_Map_example.png' }}
            style={styles.mapImage}
            resizeMode="cover"
        />
        <View style={styles.mapOverlay} />
    </View>
);

const DriverHomeScreen = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [walletBalance, setWalletBalance] = useState(5500);
    const [incomingRequest, setIncomingRequest] = useState<any>(null);
    const socket = useSocket();

    // Simulate receiving a request after going online
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isOnline) {
            timeout = setTimeout(() => {
                setIncomingRequest({
                    id: 'order_123',
                    pickup: 'Wuse 2, Abuja',
                    dropoff: 'Gwarinpa Estate, Abuja',
                    price: 1500,
                    distance: '5.2 km',
                    type: 'Express',
                });
            }, 3000); // 3 seconds after going online
        }
        return () => clearTimeout(timeout);
    }, [isOnline]);

    const handleAccept = (price: number) => {
        // console.log('Accepted at:', price);
        socket?.emit('accept_bid', { orderId: incomingRequest.id, price });
        setIncomingRequest(null);
        // Navigate to Navigation/Tracking screen
    };

    const handleBid = (price: number) => {
        // console.log('Counter Bid:', price);
        socket?.emit('driver_bid', { orderId: incomingRequest.id, price });
        setIncomingRequest(null); // Hide modal, show "Bid Sent" toast
    };

    const handleDecline = () => {
        setIncomingRequest(null);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Map Background */}
            <MapPlaceholder />

            {/* Top Bar */}
            <SafeAreaView style={styles.topContainer}>
                <View style={styles.header}>
                    <View style={styles.walletPill}>
                        <Text style={styles.walletLabel}>Balance</Text>
                        <Text style={styles.walletValue}>₦{walletBalance.toLocaleString()}</Text>
                    </View>

                    <View style={styles.onlineSwitchContainer}>
                        <Text style={[styles.statusText, isOnline ? styles.onlineText : styles.offlineText]}>
                            {isOnline ? 'Online' : 'Offline'}
                        </Text>
                        <Switch
                            value={isOnline}
                            onValueChange={setIsOnline}
                            trackColor={{ false: '#767577', true: '#4CAF50' }}
                            thumbColor={'#f4f3f4'}
                        />
                    </View>
                </View>
            </SafeAreaView>

            {/* Bottom Sheet / Status */}
            {!incomingRequest && (
                <View style={styles.bottomSheet}>
                    <Text style={styles.statusTitle}>
                        {isOnline ? 'Waiting for orders...' : 'You are offline'}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                        {isOnline
                            ? 'Stay in high demand areas to get more requests.'
                            : 'Go online to start earning money.'}
                    </Text>
                </View>
            )}

            {/* Bidding Modal */}
            {incomingRequest && (
                <BiddingModal
                    visible={!!incomingRequest}
                    request={incomingRequest}
                    onAccept={handleAccept}
                    onBid={handleBid}
                    onDecline={handleDecline}
                />
            )}
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: width,
        height: height,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.2)', // Slight overlay
    },
    topContainer: {
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    walletPill: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    walletLabel: {
        color: '#888',
        fontSize: 12,
        marginRight: 6,
    },
    walletValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    onlineSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: {
        marginRight: 8,
        fontWeight: '600',
        fontSize: 14,
    },
    onlineText: {
        color: '#4CAF50',
    },
    offlineText: {
        color: '#757575',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        alignItems: 'center',
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});

export default DriverHomeScreen;
