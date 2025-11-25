import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { BiddingModule } from './modules/bidding/bidding.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
import { validate } from './config/env.validation';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validate, // Add environment validation
        }),
        // Rate limiting
        ThrottlerModule.forRoot([{
            ttl: 60000, // 60 seconds
            limit: 100, // 100 requests per minute
        }]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                autoLoadEntities: true,
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        BiddingModule,
        WalletModule,
        OrdersModule,
        FirebaseModule,
        AuthModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    }
}
