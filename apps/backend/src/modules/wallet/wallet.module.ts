import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { FlutterwaveService } from './flutterwave.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Wallet, Transaction]),
        UsersModule,
    ],
    providers: [WalletService, FlutterwaveService],
    controllers: [WalletController],
    exports: [WalletService],
})
export class WalletModule { }
