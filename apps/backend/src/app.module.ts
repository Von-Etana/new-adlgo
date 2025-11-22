import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BiddingModule } from './modules/bidding/bidding.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';

import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                autoLoadEntities: true,
                synchronize: true, // TODO: Disable in production
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        BiddingModule,
        WalletModule,
        OrdersModule,
        FirebaseModule,
        // AuthModule, // To be implemented
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
