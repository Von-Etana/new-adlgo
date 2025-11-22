import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import { Package, Smartphone, Lightbulb, Clock } from 'lucide-react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { SERVICES, RECENT_ACTIVITY, COLORS, DIMENSIONS } from '../../config/constants';

type CustomerHomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
    navigation: CustomerHomeScreenNavigationProp;
}

const ICON_MAP: Record<string, any> = {
    'package': Package,
    'smartphone': Smartphone,
    'lightbulb': Lightbulb,
    'clock': Clock,
};

const CustomerHomeScreen = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.username}>Tunde</Text>
                    </View>
                    <TouchableOpacity style={styles.profilePic}>
                        <View style={styles.avatarPlaceholder} />
                    </TouchableOpacity>
                </View>

                {/* Wallet Widget */}
                <View style={styles.walletCard}>
                    <View>
                        <Text style={styles.walletLabel}>Wallet Balance</Text>
                        <Text style={styles.walletBalance}>₦12,000.00</Text>
                    </View>
                    <TouchableOpacity style={styles.addMoneyBtn} onPress={() => navigation.navigate('Wallet')}>
                        <Text style={styles.addMoneyText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Services Grid */}
                <Text style={styles.sectionTitle}>What would you like to do?</Text>
                <View style={styles.gridContainer}>
                    {SERVICES.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={[styles.gridItem, { backgroundColor: service.color }]}
                            onPress={() => navigation.navigate(service.route as any)}
                        >
                        >
                            {(() => {
                                const IconComponent = ICON_MAP[service.icon];
                                return IconComponent ? <IconComponent size={32} color={COLORS.primary} /> : null;
                            })()}
                            <Text style={styles.serviceTitle}>{service.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity */}
                <View style={styles.recentHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {RECENT_ACTIVITY.map((item) => (
                    <View key={item.id} style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                            <Package size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>{item.title}</Text>
                            <Text style={styles.activityDate}>{item.date}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 60) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    profilePic: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ccc',
    },
    walletCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    walletLabel: {
        color: '#AAA',
        fontSize: 12,
        marginBottom: 4,
    },
    walletBalance: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    addMoneyBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMoneyText: {
        color: '#FFF',
        fontSize: 24,
        marginTop: -2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    gridItem: {
        width: GRID_ITEM_WIDTH,
        height: GRID_ITEM_WIDTH * 0.8,
        borderRadius: 20,
        padding: 16,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    serviceIcon: {
        fontSize: 32,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAll: {
        color: '#666',
        fontSize: 14,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    activityDate: {
        fontSize: 12,
        color: '#888',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#E8F5E9',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4CAF50',
    },
});

export default CustomerHomeScreen;
