import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { FlutterwaveService } from './flutterwave.service';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);
    private readonly COMMISSION_RATE = 0.20; // 20%
    private readonly MINIMUM_BALANCE_THRESHOLD = 1000; // e.g., 1000 Naira
    private readonly ADMIN_USER_ID = 'admin'; // Admin user ID for commission collection

    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private flutterwaveService: FlutterwaveService,
        private dataSource: DataSource,
    ) { }

    // Real Database Methods
    async getUserWallet(userId: string): Promise<Wallet> {
        let wallet = await this.walletRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });

        if (!wallet) {
            // Create wallet if it doesn't exist (e.g. for new users)
            const newWallet = this.walletRepository.create({
                user: { id: userId } as any, // assuming user exists
                balance: 0,
                currency: 'NGN'
            });
            wallet = await this.walletRepository.save(newWallet);
        }
        return wallet;
    }

    /**
     * Atomically update wallet balance using pessimistic locking to prevent race conditions
     */
    private async updateBalanceAtomic(walletId: string, amount: number) {
        return await this.dataSource.transaction(async (manager) => {
            // Use pessimistic write lock to prevent concurrent updates
            const wallet = await manager.findOne(Wallet, {
                where: { id: walletId },
                lock: { mode: 'pessimistic_write' },
            });

            if (!wallet) {
                throw new Error('Wallet not found');
            }

            // Atomic balance update
            wallet.balance = Number(wallet.balance) + Number(amount);
            await manager.save(Wallet, wallet);

            return wallet;
        });
    }

    private async createTransaction(walletId: string, amount: number, type: 'credit' | 'debit', category: string, reference?: string) {
        const transaction = this.transactionRepository.create({
            wallet: { id: walletId },
            amount,
            type,
            category,
            reference
        });
        await this.transactionRepository.save(transaction);
    }

    async fundWallet(userId: string, amount: number, reference: string) {
        const wallet = await this.getUserWallet(userId);
        await this.updateBalanceAtomic(wallet.id, amount);
        await this.createTransaction(wallet.id, amount, 'credit', 'deposit', reference);

        // Fetch updated wallet
        const updatedWallet = await this.walletRepository.findOne({ where: { id: wallet.id } });

        return {
            success: true,
            newBalance: Number(updatedWallet.balance),
            message: 'Wallet funded successfully',
        };
    }

    async getTransactions(userId: string) {
        const wallet = await this.getUserWallet(userId);
        return this.transactionRepository.find({
            where: { wallet: { id: wallet.id } },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Checks if a driver can go online based on their wallet balance.
     */
    async canDriverGoOnline(driverId: string): Promise<boolean> {
        const wallet = await this.getUserWallet(driverId);
        if (Number(wallet.balance) < this.MINIMUM_BALANCE_THRESHOLD) {
            throw new BadRequestException(`Insufficient balance. Minimum ₦${this.MINIMUM_BALANCE_THRESHOLD} required to go online.`);
        }
        return true;
    }

    /**
     * Calculates and processes commission based on payment method.
     * @param orderTotal The final agreed price of the trip
     * @param paymentMethod 'WALLET' or 'CASH'
     * @param customerId 
     * @param driverId 
     */
    async processOrderPayment(orderTotal: number, paymentMethod: 'WALLET' | 'CASH', customerId: string, driverId: string) {
        // Get or create admin wallet
        const adminWallet = await this.getUserWallet(this.ADMIN_USER_ID);
        const driverWallet = await this.getUserWallet(driverId);
        const customerWallet = await this.getUserWallet(customerId);

        const commissionAmount = orderTotal * this.COMMISSION_RATE;
        const driverEarnings = orderTotal - commissionAmount;

        if (paymentMethod === 'WALLET') {
            // 1. Deduct Full Amount from Customer
            if (Number(customerWallet.balance) < orderTotal) {
                throw new BadRequestException('Customer has insufficient funds');
            }
            await this.updateBalanceAtomic(customerWallet.id, -orderTotal);
            await this.createTransaction(customerWallet.id, orderTotal, 'debit', 'payment', `Order Payment`);

            // 2. Credit Driver (80%)
            await this.updateBalanceAtomic(driverWallet.id, driverEarnings);
            await this.createTransaction(driverWallet.id, driverEarnings, 'credit', 'earnings', `Order Earnings`);

            // 3. Credit Admin (20%)
            await this.updateBalanceAtomic(adminWallet.id, commissionAmount);
            await this.createTransaction(adminWallet.id, commissionAmount, 'credit', 'commission', `Commission from Order`);

        } else if (paymentMethod === 'CASH') {
            // Driver collects 100% Cash from Customer physically.
            // We need to deduct the 20% commission from the Driver's digital wallet.

            if (Number(driverWallet.balance) < commissionAmount) {
                this.logger.warn(`Driver ${driverId} has low balance for commission deduction`);
            }

            // Deduct 20% from Driver
            await this.updateBalanceAtomic(driverWallet.id, -commissionAmount);
            await this.createTransaction(driverWallet.id, commissionAmount, 'debit', 'commission_deduction', `Commission Deduction (Cash Order)`);

            // Credit Admin (20%)
            await this.updateBalanceAtomic(adminWallet.id, commissionAmount);
            await this.createTransaction(adminWallet.id, commissionAmount, 'credit', 'commission', `Commission from Cash Order`);
        }

        return {
            success: true,
            distribution: {
                driver: paymentMethod === 'WALLET' ? driverEarnings : orderTotal, // If cash, they keep all cash physically
                admin: commissionAmount,
                method: paymentMethod
            }
        };
    }

    async payBill(userId: string, provider: string, identifier: string, amount: number) {
        const wallet = await this.getUserWallet(userId);

        if (Number(wallet.balance) < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }

        // 1. Validate Bill Service (Optional but recommended)
        // await this.flutterwaveService.validateBillService(provider, identifier, provider);

        // 2. Deduct from Wallet atomically
        await this.updateBalanceAtomic(wallet.id, -amount);
        await this.createTransaction(wallet.id, amount, 'debit', `Bill Payment: ${provider}`, `BILL_${Date.now()}_${userId}`);

        // 3. Call Flutterwave API
        try {
            const paymentResponse = await this.flutterwaveService.createPayment({
                country: 'NG',
                customer: identifier,
                amount: amount,
                recurrence: 'ONCE',
                type: provider, // e.g., AIRTIME, DSTV
                reference: `BILL_${Date.now()}_${userId}`,
            });

            return {
                success: true,
                message: 'Bill payment successful',
                data: paymentResponse,
                newBalance: Number(wallet.balance) - amount,
            };
        } catch (error) {
            // Rollback if external API fails
            await this.updateBalanceAtomic(wallet.id, amount);
            await this.createTransaction(wallet.id, amount, 'credit', `Refund: Failed Bill Payment ${provider}`);
            throw error;
        }
    }
}
