import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { SessionGuard } from '../auth/session.guard';
import { User } from '../../common/decorators/user.decorator';
import { UserDto, FundWalletDto, PayBillDto } from '../../common/dto';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @UseGuards(SessionGuard)
    @Get('balance')
    async getBalance(@User() user: UserDto) {
        const userId = user.id;
        const canGoOnline = await this.walletService.canDriverGoOnline(userId);
        const wallet = await this.walletService.getUserWallet(userId);
        return {
            balance: Number(wallet.balance),
            currency: wallet.currency,
            canGoOnline,
        };
    }

    @UseGuards(SessionGuard)
    @Post('fund')
    async fundWallet(@User() user: UserDto, @Body() body: FundWalletDto) {
        const userId = user.id;
        // Integrate with Paystack/Flutterwave verification here
        // For now, we trust the reference and amount (In production, verify reference with provider)
        return this.walletService.fundWallet(userId, body.amount, body.reference);
    }

    @UseGuards(SessionGuard)
    @Get('transactions')
    async getTransactions(@User() user: UserDto) {
        const userId = user.id;
        return this.walletService.getTransactions(userId);
    }

    @UseGuards(SessionGuard)
    @Post('bill-payment')
    async payBill(@User() user: UserDto, @Body() body: PayBillDto) {
        return this.walletService.payBill(user.id, body.provider, body.identifier, body.amount);
    }
}
