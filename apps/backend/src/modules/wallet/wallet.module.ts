import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

import { FlutterwaveService } from './flutterwave.service';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
    controllers: [WalletController],
    providers: [WalletService, FlutterwaveService],
    exports: [WalletService, FlutterwaveService, TypeOrmModule],
})
export class WalletModule { }
