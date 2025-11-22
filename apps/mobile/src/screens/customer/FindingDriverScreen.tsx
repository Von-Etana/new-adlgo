import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { MOCK_DRIVERS } from '../../config/constants';

type FindingDriverScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FindingDriver'>;

interface Props {
    navigation: FindingDriverScreenNavigationProp;
}

const FindingDriverScreen = ({ navigation }: Props) => {
    const [drivers, setDrivers] = useState<any[]>([]);

    useEffect(() => {
        // Simulate drivers bidding over time
        const timer1 = setTimeout(() => setDrivers([MOCK_DRIVERS[0]]), 1000);
        const timer2 = setTimeout(() => setDrivers([MOCK_DRIVERS[0], MOCK_DRIVERS[1]]), 2500);
        const timer3 = setTimeout(() => setDrivers(MOCK_DRIVERS), 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    const handleAccept = (driver: any) => {
        // Navigate to Tracking
        navigation.navigate('Tracking', { driver });
    };

    const renderDriverItem = ({ item }: { item: any }) => (
        <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View>
                    <Text style={styles.driverName}>{item.name}</Text>
                    <Text style={styles.driverDetails}>★ {item.rating} • {item.vehicle}</Text>
                </View>
            </View>

            <View style={styles.offerContainer}>
                <Text style={styles.offerPrice}>₦{item.price}</Text>
                <Text style={styles.offerTime}>{item.time} away</Text>
            </View>

            <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
                <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.radarContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
                <Text style={styles.title}>Finding drivers nearby...</Text>
                <Text style={styles.subtitle}>Drivers are reviewing your offer</Text>
            </View>

            <FlatList
                data={drivers}
                renderItem={renderDriverItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Waiting for bids...</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    radarContainer: {
        marginBottom: 20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    listContent: {
        padding: 20,
    },
    driverCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    driverName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    driverDetails: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    offerContainer: {
        alignItems: 'flex-end',
        marginRight: 16,
    },
    offerPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    offerTime: {
        fontSize: 12,
        color: '#4CAF50',
    },
    acceptButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    acceptText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#888',
    },
});

export default FindingDriverScreen;
