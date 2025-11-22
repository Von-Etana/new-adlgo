import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get(':userId/balance')
    async getBalance(@Param('userId') userId: string) {
        // In a real app, userId would come from the JWT token (@User() decorator)
        const canGoOnline = await this.walletService.canDriverGoOnline(userId);
        // Mock response for now as the service uses mock data
        return {
            balance: 5500.00,
            currency: 'NGN',
            canGoOnline,
        };
    }

    @Post('fund')
    async fundWallet(@Body() body: { userId: string; amount: number; reference: string }) {
        // Integrate with Paystack/Flutterwave verification here
        return {
            success: true,
            newBalance: 5500 + body.amount,
            message: 'Wallet funded successfully',
        };
    }

    @Get(':userId/transactions')
    async getTransactions(@Param('userId') userId: string) {
        return [
            { id: '1', title: 'Ride to Wuse 2', amount: -1500, date: 'Today, 10:23 AM', type: 'debit' },
            { id: '2', title: 'Wallet Funding', amount: 5000, date: 'Yesterday, 4:00 PM', type: 'credit' },
            { id: '3', title: 'MTN Airtime', amount: -1000, date: 'Yesterday, 2:15 PM', type: 'debit' },
        ];
    }

    @Post('bill-payment')
    async payBill(@Body() body: { userId: string; provider: string; identifier: string; amount: number }) {
        return this.walletService.payBill(body.userId, body.provider, body.identifier, body.amount);
    }
}
