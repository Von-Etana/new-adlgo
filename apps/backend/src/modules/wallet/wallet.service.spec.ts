import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { FlutterwaveService } from './flutterwave.service';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('WalletService', () => {
    let service: WalletService;
    let walletRepository: any;
    let transactionRepository: any;
    let flutterwaveService: FlutterwaveService;
    let dataSource: DataSource;

    const mockWalletRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockTransactionRepository = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockFlutterwaveService = {
        createPayment: jest.fn(),
    };

    const mockDataSource = {
        transaction: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WalletService,
                {
                    provide: getRepositoryToken(Wallet),
                    useValue: mockWalletRepository,
                },
                {
                    provide: getRepositoryToken(Transaction),
                    useValue: mockTransactionRepository,
                },
                {
                    provide: FlutterwaveService,
                    useValue: mockFlutterwaveService,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<WalletService>(WalletService);
        walletRepository = module.get(getRepositoryToken(Wallet));
        transactionRepository = module.get(getRepositoryToken(Transaction));
        flutterwaveService = module.get<FlutterwaveService>(FlutterwaveService);
        dataSource = module.get<DataSource>(DataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserWallet', () => {
        it('should return existing wallet', async () => {
            const mockWallet = {
                id: 'wallet-123',
                user: { id: 'user-123' },
                balance: 5000,
                currency: 'NGN',
            };

            mockWalletRepository.findOne.mockResolvedValue(mockWallet);

            const result = await service.getUserWallet('user-123');

            expect(result).toEqual(mockWallet);
            expect(mockWalletRepository.findOne).toHaveBeenCalledWith({
                where: { user: { id: 'user-123' } },
                relations: ['user'],
            });
        });

        it('should create wallet if not exists', async () => {
            mockWalletRepository.findOne.mockResolvedValue(null);
            mockWalletRepository.create.mockReturnValue({
                user: { id: 'user-123' },
                balance: 0,
                currency: 'NGN',
            });
            mockWalletRepository.save.mockResolvedValue({
                id: 'wallet-123',
                balance: 0,
                currency: 'NGN',
            });

            const result = await service.getUserWallet('user-123');

            expect(result.balance).toBe(0);
            expect(mockWalletRepository.save).toHaveBeenCalled();
        });
    });

    describe('fundWallet', () => {
        it('should successfully fund wallet', async () => {
            const mockWallet = {
                id: 'wallet-123',
                balance: 1000,
            };

            const mockManager = {
                findOne: jest.fn().mockResolvedValue(mockWallet),
                save: jest.fn().mockResolvedValue({ ...mockWallet, balance: 2000 }),
            };

            mockDataSource.transaction.mockImplementation(async (callback) => {
                return callback(mockManager);
            });

            mockWalletRepository.findOne.mockResolvedValue({ ...mockWallet, balance: 2000 });
            mockTransactionRepository.create.mockReturnValue({});
            mockTransactionRepository.save.mockResolvedValue({});

            const result = await service.fundWallet('user-123', 1000, 'ref-123');

            expect(result.success).toBe(true);
            expect(result.newBalance).toBe(2000);
        });
    });

    describe('canDriverGoOnline', () => {
        it('should allow driver with sufficient balance', async () => {
            const mockWallet = {
                id: 'wallet-123',
                balance: 2000,
            };

            mockWalletRepository.findOne.mockResolvedValue(mockWallet);

            const result = await service.canDriverGoOnline('driver-123');

            expect(result).toBe(true);
        });

        it('should throw error for insufficient balance', async () => {
            const mockWallet = {
                id: 'wallet-123',
                balance: 500,
            };

            mockWalletRepository.findOne.mockResolvedValue(mockWallet);

            await expect(service.canDriverGoOnline('driver-123')).rejects.toThrow(
                BadRequestException
            );
        });
    });

    describe('processOrderPayment', () => {
        it('should process WALLET payment correctly', async () => {
            const mockCustomerWallet = { id: 'customer-wallet', balance: 5000 };
            const mockDriverWallet = { id: 'driver-wallet', balance: 1000 };
            const mockAdminWallet = { id: 'admin-wallet', balance: 0 };

            const mockManager = {
                findOne: jest.fn().mockResolvedValue({ balance: 1000 }),
                save: jest.fn().mockResolvedValue({}),
            };

            mockDataSource.transaction.mockImplementation(async (callback) => {
                return callback(mockManager);
            });

            jest.spyOn(service, 'getUserWallet')
                .mockResolvedValueOnce(mockAdminWallet as any)
                .mockResolvedValueOnce(mockDriverWallet as any)
                .mockResolvedValueOnce(mockCustomerWallet as any);

            mockTransactionRepository.create.mockReturnValue({});
            mockTransactionRepository.save.mockResolvedValue({});

            const result = await service.processOrderPayment(1000, 'WALLET', 'customer-123', 'driver-123');

            expect(result.success).toBe(true);
            expect(result.distribution.driver).toBe(800); // 80% of 1000
            expect(result.distribution.admin).toBe(200); // 20% of 1000
        });

        it('should throw error for insufficient customer balance', async () => {
            const mockCustomerWallet = { id: 'customer-wallet', balance: 500 };
            const mockDriverWallet = { id: 'driver-wallet', balance: 1000 };
            const mockAdminWallet = { id: 'admin-wallet', balance: 0 };

            jest.spyOn(service, 'getUserWallet')
                .mockResolvedValueOnce(mockAdminWallet as any)
                .mockResolvedValueOnce(mockDriverWallet as any)
                .mockResolvedValueOnce(mockCustomerWallet as any);

            await expect(
                service.processOrderPayment(1000, 'WALLET', 'customer-123', 'driver-123')
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('payBill', () => {
        it('should successfully pay bill', async () => {
            const mockWallet = { id: 'wallet-123', balance: 5000 };

            const mockManager = {
                findOne: jest.fn().mockResolvedValue(mockWallet),
                save: jest.fn().mockResolvedValue({ ...mockWallet, balance: 4000 }),
            };

            mockDataSource.transaction.mockImplementation(async (callback) => {
                return callback(mockManager);
            });

            jest.spyOn(service, 'getUserWallet').mockResolvedValue(mockWallet as any);
            mockTransactionRepository.create.mockReturnValue({});
            mockTransactionRepository.save.mockResolvedValue({});
            mockFlutterwaveService.createPayment.mockResolvedValue({ status: 'success' });
            mockWalletRepository.findOne.mockResolvedValue({ ...mockWallet, balance: 4000 });

            const result = await service.payBill('user-123', 'electricity', '123456789', 1000);

            expect(result.success).toBe(true);
            expect(mockFlutterwaveService.createPayment).toHaveBeenCalled();
        });

        it('should rollback on payment failure', async () => {
            const mockWallet = { id: 'wallet-123', balance: 5000 };

            const mockManager = {
                findOne: jest.fn().mockResolvedValue(mockWallet),
                save: jest.fn().mockResolvedValue({ ...mockWallet, balance: 4000 }),
            };

            mockDataSource.transaction.mockImplementation(async (callback) => {
                return callback(mockManager);
            });

            jest.spyOn(service, 'getUserWallet').mockResolvedValue(mockWallet as any);
            mockTransactionRepository.create.mockReturnValue({});
            mockTransactionRepository.save.mockResolvedValue({});
            mockFlutterwaveService.createPayment.mockRejectedValue(new Error('Payment failed'));

            await expect(
                service.payBill('user-123', 'electricity', '123456789', 1000)
            ).rejects.toThrow('Payment failed');

            // Verify rollback transaction was created
            expect(mockDataSource.transaction).toHaveBeenCalled();
        });
    });
});
