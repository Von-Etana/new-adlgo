import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { FlutterwaveService } from './flutterwave.service';

@Injectable()
export class WalletService {
    private readonly COMMISSION_RATE = 0.20; // 20%
    private readonly MINIMUM_BALANCE_THRESHOLD = 1000; // e.g., 1000 Naira

    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private flutterwaveService: FlutterwaveService,
    ) { }

    // Mock Database Methods - TODO: Implement with TypeORM
    private async getUserWallet(userId: string) {
        // In real app: return this.walletRepo.findOne({ where: { user: { id: userId } } });
        return { id: 'wallet_1', userId, balance: 5000 };
    }

    private async updateBalance(walletId: string, amount: number) {
        console.log(`Updating wallet ${walletId} by ${amount}`);
        // In real app: update DB
    }

    private async createTransaction(walletId: string, amount: number, type: 'credit' | 'debit', category: string) {
        console.log(`Transaction: ${type} ${amount} for ${category} on wallet ${walletId}`);
    }

    /**
     * Checks if a driver can go online based on their wallet balance.
     */
    async canDriverGoOnline(driverId: string): Promise<boolean> {
        const wallet = await this.getUserWallet(driverId);
        if (wallet.balance < this.MINIMUM_BALANCE_THRESHOLD) {
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
        const adminWalletId = 'admin_wallet_001';
        const driverWallet = await this.getUserWallet(driverId);
        const customerWallet = await this.getUserWallet(customerId);

        const commissionAmount = orderTotal * this.COMMISSION_RATE;
        const driverEarnings = orderTotal - commissionAmount;

        if (paymentMethod === 'WALLET') {
            // 1. Deduct Full Amount from Customer
            if (customerWallet.balance < orderTotal) {
                throw new BadRequestException('Customer has insufficient funds');
            }
            await this.updateBalance(customerWallet.id, -orderTotal);
            await this.createTransaction(customerWallet.id, orderTotal, 'debit', 'payment');

            // 2. Credit Driver (80%)
            await this.updateBalance(driverWallet.id, driverEarnings);
            await this.createTransaction(driverWallet.id, driverEarnings, 'credit', 'earnings');

            // 3. Credit Admin (20%)
            await this.updateBalance(adminWalletId, commissionAmount);
            await this.createTransaction(adminWalletId, commissionAmount, 'credit', 'commission');

        } else if (paymentMethod === 'CASH') {
            // Driver collects 100% Cash from Customer physically.
            // We need to deduct the 20% commission from the Driver's digital wallet.

            if (driverWallet.balance < commissionAmount) {
                // This should ideally be checked before the ride starts, but as a safeguard:
                // We might allow negative balance up to a limit, or block future rides.
                console.warn(`Driver ${driverId} has low balance for commission deduction.`);
            }

            // Deduct 20% from Driver
            await this.updateBalance(driverWallet.id, -commissionAmount);
            await this.createTransaction(driverWallet.id, commissionAmount, 'debit', 'commission_deduction');

            // Credit Admin (20%)
            await this.updateBalance(adminWalletId, commissionAmount);
            await this.createTransaction(adminWalletId, commissionAmount, 'credit', 'commission');
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

        if (wallet.balance < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }

        // 1. Validate Bill Service (Optional but recommended)
        // await this.flutterwaveService.validateBillService(provider, identifier, provider);

        // 2. Deduct from Wallet
        await this.updateBalance(wallet.id, -amount);
        await this.createTransaction(wallet.id, amount, 'debit', `Bill Payment: ${provider}`);

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
                newBalance: wallet.balance - amount,
            };
        } catch (error) {
            // Rollback if external API fails
            await this.updateBalance(wallet.id, amount);
            await this.createTransaction(wallet.id, amount, 'credit', `Refund: Failed Bill Payment ${provider}`);
        }
    }
}
