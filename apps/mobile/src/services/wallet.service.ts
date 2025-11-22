import api from './api';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
}

export interface WalletData {
    balance: number;
    currency: string;
    canGoOnline: boolean;
}

export const WalletService = {
    getBalance: async (userId: string): Promise<WalletData> => {
        const response = await api.get(`/wallet/${userId}/balance`);
        return response.data;
    },

    getTransactions: async (userId: string): Promise<Transaction[]> => {
        const response = await api.get(`/wallet/${userId}/transactions`);
        return response.data;
    },

    fundWallet: async (userId: string, amount: number, reference: string) => {
        const response = await api.post('/wallet/fund', { userId, amount, reference });
        return response.data;
    },

    payBill: async (userId: string, provider: string, identifier: string, amount: number) => {
        const response = await api.post('/wallet/bill-payment', { userId, provider, identifier, amount });
        return response.data;
    },
};
