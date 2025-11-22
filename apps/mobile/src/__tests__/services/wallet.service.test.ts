import { WalletService } from '../../services/wallet.service';

// Mock axios
jest.mock('axios');
import axios from 'axios';

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('WalletService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should fetch wallet balance successfully', async () => {
      const mockData = {
        balance: 1000,
        currency: 'NGN',
        canGoOnline: true,
      };
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await WalletService.getBalance('user1');

      expect(mockAxios.get).toHaveBeenCalledWith('/wallet/user1/balance');
      expect(result).toEqual(mockData);
    });

    it('should throw error on API failure', async () => {
      const mockError = new Error('Network error');
      mockAxios.get.mockRejectedValue(mockError);

      await expect(WalletService.getBalance('user1')).rejects.toThrow('Network error');
    });
  });

  describe('getTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockTransactions = [
        {
          id: 'tx1',
          title: 'Payment received',
          amount: 500,
          date: '2023-01-01',
          type: 'credit' as const,
        },
        {
          id: 'tx2',
          title: 'Delivery fee',
          amount: -200,
          date: '2023-01-02',
          type: 'debit' as const,
        },
      ];
      mockAxios.get.mockResolvedValue({ data: mockTransactions });

      const result = await WalletService.getTransactions('user1');

      expect(mockAxios.get).toHaveBeenCalledWith('/wallet/user1/transactions');
      expect(result).toEqual(mockTransactions);
    });

    it('should return empty array if no transactions', async () => {
      mockAxios.get.mockResolvedValue({ data: [] });

      const result = await WalletService.getTransactions('user1');

      expect(result).toEqual([]);
    });
  });

  describe('fundWallet', () => {
    it('should fund wallet successfully', async () => {
      const mockResponse = { success: true, reference: 'ref123' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await WalletService.fundWallet('user1', 1000, 'ref123');

      expect(mockAxios.post).toHaveBeenCalledWith('/wallet/fund', {
        userId: 'user1',
        amount: 1000,
        reference: 'ref123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on funding failure', async () => {
      const mockError = new Error('Funding failed');
      mockAxios.post.mockRejectedValue(mockError);

      await expect(WalletService.fundWallet('user1', 1000, 'ref123')).rejects.toThrow('Funding failed');
    });
  });

  describe('payBill', () => {
    it('should pay bill successfully', async () => {
      const mockResponse = { success: true, transactionId: 'tx123' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await WalletService.payBill('user1', 'electricity', '123456789', 5000);

      expect(mockAxios.post).toHaveBeenCalledWith('/wallet/bill-payment', {
        userId: 'user1',
        provider: 'electricity',
        identifier: '123456789',
        amount: 5000,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on bill payment failure', async () => {
      const mockError = new Error('Payment failed');
      mockAxios.post.mockRejectedValue(mockError);

      await expect(WalletService.payBill('user1', 'electricity', '123456789', 5000)).rejects.toThrow('Payment failed');
    });
  });
});