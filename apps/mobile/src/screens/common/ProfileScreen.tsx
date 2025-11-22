import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Switch,
} from 'react-native';
import { User, CreditCard, Clock, Lock, Headphones, LogOut, Edit2, ChevronRight } from 'lucide-react-native';

const ProfileScreen = ({ navigation }: any) => {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [locationEnabled, setLocationEnabled] = React.useState(true);

    const MENU_ITEMS = [
        { id: 'account', icon: User, label: 'Account Details', subtitle: 'Edit name, phone, email' },
        { id: 'payment', icon: CreditCard, label: 'Payment Methods', subtitle: 'Cards, Bank Account' },
        { id: 'history', icon: Clock, label: 'Order History', subtitle: 'Past deliveries and bills' },
        { id: 'security', icon: Lock, label: 'Security', subtitle: 'Password, 2FA' },
        { id: 'support', icon: Headphones, label: 'Help & Support', subtitle: 'Chat with us' },
        { id: 'logout', icon: LogOut, label: 'Log Out', subtitle: '', color: '#F44336' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Header Profile Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>T</Text>
                        <View style={styles.editBadge}>
                            <Edit2 size={16} color="#FFF" />
                        </View>
                    </View>
                    <Text style={styles.name}>Tunde User</Text>
                    <Text style={styles.email}>tunde@example.com</Text>
                    <View style={styles.ratingPill}>
                        <Text style={styles.ratingText}>★ 4.9 Customer Rating</Text>
                    </View>
                </View>

                {/* Settings Toggles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Push Notifications</Text>
                            <Text style={styles.settingSub}>Order updates, promos</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#767577', true: '#4CAF50' }}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Location Services</Text>
                            <Text style={styles.settingSub}>For better pickup accuracy</Text>
                        </View>
                        <Switch
                            value={locationEnabled}
                            onValueChange={setLocationEnabled}
                            trackColor={{ false: '#767577', true: '#4CAF50' }}
                        />
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.section}>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <item.icon size={20} color={item.color || '#333'} />
                            </View>
                            <View style={styles.menuInfo}>
                                <Text style={[styles.menuLabel, item.color ? { color: item.color } : undefined]}>
                                    {item.label}
                                </Text>
                                {item.subtitle ? <Text style={styles.menuSub}>{item.subtitle}</Text> : null}
                            </View>
                            <ChevronRight size={20} color="#CCC" />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.version}>Version 1.0.0 (Build 2025)</Text>

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
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#555',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    editIcon: {
        color: '#FFF',
        fontSize: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    ratingPill: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    ratingText: {
        color: '#F57C00',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1A1A1A',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 2,
    },
    settingSub: {
        fontSize: 12,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuIcon: {
        fontSize: 20,
    },
    menuInfo: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    menuSub: {
        fontSize: 12,
        color: '#AAA',
        marginTop: 2,
    },
    chevron: {
        fontSize: 20,
        color: '#CCC',
    },
    version: {
        textAlign: 'center',
        color: '#CCC',
        fontSize: 12,
        marginBottom: 20,
    },
});

export default ProfileScreen;
