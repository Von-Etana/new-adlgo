import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { WalletService } from '../../services/wallet.service';
import { RootStackParamList } from '../../types';
import { validateAmount, validateMeterNumber } from '../../utils/validation';

const BILL_CATEGORIES = [
    { id: 'airtime', name: 'Airtime', icon: '📱' },
    { id: 'data', name: 'Data', icon: 'wifi' }, // Using text icon for simplicity, replace with image if needed
    { id: 'tv', name: 'TV / Cable', icon: '📺' },
    { id: 'electricity', name: 'Electricity', icon: '⚡' },
];

const PROVIDERS = {
    airtime: [
        { id: 'mtn', name: 'MTN', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg', color: '#FFCC00' },
        { id: 'airtel', name: 'Airtel', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Airtel_logo_2010.svg', color: '#FF0000' }, // SVG might not load in Image directly without library, using color fallback
        { id: 'glo', name: 'Glo', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Glo_button.png', color: '#00FF00' },
        { id: '9mobile', name: '9mobile', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/98/9mobile_Logo.png', color: '#006400' },
    ],
    data: [
        { id: 'mtn', name: 'MTN Data', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg', color: '#FFCC00' },
        { id: 'airtel', name: 'Airtel Data', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Airtel_logo_2010.svg', color: '#FF0000' },
        { id: 'glo', name: 'Glo Data', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Glo_button.png', color: '#00FF00' },
        { id: '9mobile', name: '9mobile Data', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/98/9mobile_Logo.png', color: '#006400' },
        { id: 'spectranet', name: 'Spectranet', logo: '', color: '#0056D2' },
    ],
    tv: [
        { id: 'dstv', name: 'DSTV', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/DStv_Logo_2012.png/640px-DStv_Logo_2012.png', color: '#00A1E4' },
        { id: 'gotv', name: 'GOTV', logo: '', color: '#F47920' },
        { id: 'startimes', name: 'StarTimes', logo: '', color: '#FF6600' },
    ],
    electricity: [
        { id: 'ikedc', name: 'Ikeja Electric', logo: '', color: '#F47920' },
        { id: 'ekedc', name: 'Eko Electric', logo: '', color: '#004B8D' },
        { id: 'aedc', name: 'Abuja Electric', logo: '', color: '#008000' },
    ],
};

const BillPaymentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'BillPayment'>>();

    // Default to airtime if no param passed, or use the provider passed from WalletScreen
    const initialProvider = route.params?.provider;
    const [selectedCategory, setSelectedCategory] = useState<string>(initialProvider ? 'airtime' : 'airtime');
    const [selectedProvider, setSelectedProvider] = useState<any>(initialProvider || null);

    const [identifier, setIdentifier] = useState(''); // Phone or Smartcard Number
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        // Validate inputs
        if (!selectedProvider) {
            Alert.alert('Error', 'Please select a provider');
            return;
        }

        if (!identifier || identifier.trim().length === 0) {
            Alert.alert('Error', 'Please enter phone/meter number');
            return;
        }

        // Validate meter number for electricity/cable TV
        if (['electricity', 'cable'].includes(selectedCategory.id)) {
            const meterValidation = validateMeterNumber(identifier);
            if (!meterValidation.isValid) {
                Alert.alert('Invalid Number', meterValidation.error);
                return;
            }
        }

        // Validate amount
        const amountValidation = validateAmount(amount);
        if (!amountValidation.isValid) {
            Alert.alert('Invalid Amount', amountValidation.error);
            return;
        }

        setLoading(true);
        try {
            // Call Backend API
            const result = await WalletService.payBill(
                selectedProvider.id,
                identifier,
                parseFloat(amount)
            );

            Alert.alert('Success', 'Payment Successful!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Payment Failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const renderProviderLogo = (provider: any) => {
        if (provider.logo && provider.logo.startsWith('http')) {
            return <Image source={{ uri: provider.logo }} style={styles.providerLogoImage} resizeMode="contain" />;
        }
        return (
            <View style={[styles.providerLogoPlaceholder, { backgroundColor: provider.color }]}>
                <Text style={styles.providerLogoText}>{provider.name[0]}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pay Bills</Text>
                </View>

                {/* Categories */}
                <Text style={styles.sectionLabel}>Select Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
                    {BILL_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat.id && styles.categoryChipSelected
                            ]}
                            onPress={() => {
                                setSelectedCategory(cat.id);
                                setSelectedProvider(null); // Reset provider on category change
                            }}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat.id && styles.categoryTextSelected
                            ]}>{cat.icon} {cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Providers Grid */}
                <Text style={styles.sectionLabel}>Select Provider</Text>
                <View style={styles.providersGrid}>
                    {PROVIDERS[selectedCategory as keyof typeof PROVIDERS]?.map((provider: any) => (
                        <TouchableOpacity
                            key={provider.id}
                            style={[
                                styles.providerCard,
                                selectedProvider?.id === provider.id && styles.providerCardSelected
                            ]}
                            onPress={() => setSelectedProvider(provider)}
                        >
                            {renderProviderLogo(provider)}
                            <Text style={styles.providerName}>{provider.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Input Fields */}
                {selectedProvider && (
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>
                            {selectedCategory === 'tv' || selectedCategory === 'electricity' ? 'Meter / Smartcard Number' : 'Phone Number'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter number"
                            keyboardType="numeric"
                            value={identifier}
                            onChangeText={setIdentifier}
                        />

                        <Text style={styles.inputLabel}>Amount (₦)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <TouchableOpacity
                            style={[styles.payButton, loading && styles.payButtonDisabled]}
                            onPress={handlePay}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.payButtonText}>Pay ₦{amount || '0.00'}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#666',
    },
    categoriesRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryChipSelected: {
        backgroundColor: '#1A1A1A',
        borderColor: '#1A1A1A',
    },
    categoryText: {
        color: '#333',
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    providersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
    },
    providerCard: {
        width: '30%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    providerCardSelected: {
        borderColor: '#1A1A1A',
    },
    providerLogoImage: {
        width: 40,
        height: 40,
        marginBottom: 8,
    },
    providerLogoPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    providerLogoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    providerName: {
        fontSize: 12,
        textAlign: 'center',
        color: '#333',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    payButton: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    payButtonDisabled: {
        backgroundColor: '#999',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BillPaymentScreen;
