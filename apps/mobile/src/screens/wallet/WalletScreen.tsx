import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { WalletService, Transaction, WalletData } from '../../services/wallet.service';
import { useToast } from '../../context/ToastContext';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { BILL_PROVIDERS } from '../../config/constants';

type WalletScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Wallet'>;

const WalletScreen = () => {
    const navigation = useNavigation<WalletScreenNavigationProp>();
    const { showToast } = useToast();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock User ID
    const USER_ID = 'user_123';



    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const [balanceData, txData] = await Promise.all([
                WalletService.getBalance(USER_ID),
                WalletService.getTransactions(USER_ID),
            ]);
            setWalletData(balanceData);
            setTransactions(txData);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
            showToast('Could not load wallet details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFundWallet = async () => {
        try {
            // In real app: Launch Paystack/Flutterwave SDK here
            // On success:
            await WalletService.fundWallet(USER_ID, 5000, 'ref_mock_' + Date.now());
            showToast('Wallet funded successfully!', 'success');
            fetchWalletData(); // Refresh
        } catch (error) {
            showToast('Funding failed', 'error');
        }
    };

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
                {item.type === 'credit' ? (
                    <ArrowDownLeft size={18} color="#4CAF50" />
                ) : (
                    <ArrowUpRight size={18} color="#1A1A1A" />
                )}
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text
                style={[
                    styles.transactionAmount,
                    item.type === 'credit' ? styles.creditText : styles.debitText,
                ]}
            >
                {item.type === 'credit' ? '+' : '-'}₦{Math.abs(item.amount).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Wallet</Text>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceAmount}>
                        ₦{walletData?.balance?.toLocaleString() || '0.00'}
                    </Text>
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleFundWallet}>
                            <Text style={styles.actionButtonText}>+ Fund Wallet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]}>
                            <Text style={[styles.actionButtonText, styles.withdrawText]}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bill Payments */}
                <Text style={styles.sectionTitle}>Pay Bills</Text>
                <View style={styles.billsGrid}>
                    {BILL_PROVIDERS.map((provider) => (
                        <TouchableOpacity
                            key={provider.id}
                            style={styles.billItem}
                            onPress={() => navigation.navigate('BillPayment', { provider })}
                        >
                            <View style={[styles.billLogo, { backgroundColor: provider.color }]}>
                                <Text style={styles.billLogoText}>{provider.name[0]}</Text>
                            </View>
                            <Text style={styles.billName}>{provider.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Transactions */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.transactionsList}>
                    {transactions.map((item) => (
                        <View key={item.id}>
                            {renderTransaction({ item })}
                            <View style={styles.divider} />
                        </View>
                    ))}
                </View>
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1A1A1A',
    },
    balanceCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    balanceLabel: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    withdrawButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    withdrawText: {
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1A1A1A',
    },
    billsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    billItem: {
        width: '23%',
        alignItems: 'center',
        marginBottom: 16,
    },
    billLogo: {
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    billLogoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    billName: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    transactionsList: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    transactionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    transactionIcon: {
        fontSize: 18,
        color: '#333',
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#888',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    creditText: {
        color: '#4CAF50',
    },
    debitText: {
        color: '#1A1A1A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
});

export default WalletScreen;
