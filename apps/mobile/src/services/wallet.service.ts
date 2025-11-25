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
    getBalance: async (): Promise<WalletData> => {
        const response = await api.get(`/wallet/balance`);
        return response.data;
    },

    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get(`/wallet/transactions`);
        return response.data;
    },

    fundWallet: async (amount: number, reference: string) => {
        const response = await api.post('/wallet/fund', { amount, reference });
        return response.data;
    },

    payBill: async (provider: string, identifier: string, amount: number) => {
        const response = await api.post('/wallet/bill-payment', { provider, identifier, amount });
        return response.data;
    },
};
