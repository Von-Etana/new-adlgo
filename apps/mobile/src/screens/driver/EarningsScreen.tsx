import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Dimensions,
} from 'react-native';

const EarningsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Earnings</Text>

                {/* Today's Stats */}
                <View style={styles.todayCard}>
                    <Text style={styles.label}>Today's Earnings</Text>
                    <Text style={styles.amount}>₦12,500</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>8</Text>
                            <Text style={styles.statLabel}>Trips</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.5h</Text>
                            <Text style={styles.statLabel}>Online</Text>
                        </View>
                    </View>
                </View>

                {/* Chart Placeholder */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Weekly Summary</Text>
                    <View style={styles.chartPlaceholder}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <View key={day} style={styles.barContainer}>
                                <View style={[styles.bar, { height: 40 + Math.random() * 100 }]} />
                                <Text style={styles.dayLabel}>{day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Trips */}
                <Text style={styles.sectionTitle}>Recent Trips</Text>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.tripItem}>
                        <View>
                            <Text style={styles.tripRoute}>Wuse 2 → Gwarinpa</Text>
                            <Text style={styles.tripTime}>Today, 10:30 AM</Text>
                        </View>
                        <Text style={styles.tripAmount}>+₦1,500</Text>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1A1A1A',
    },
    todayCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    label: {
        color: '#AAA',
        fontSize: 14,
        marginBottom: 8,
    },
    amount: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#AAA',
        fontSize: 12,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    chartCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    chartPlaceholder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
    },
    barContainer: {
        alignItems: 'center',
    },
    bar: {
        width: 8,
        backgroundColor: '#4CAF50',
        borderRadius: 4,
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 10,
        color: '#888',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    tripItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    tripRoute: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    tripTime: {
        fontSize: 12,
        color: '#888',
    },
    tripAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default EarningsScreen;
