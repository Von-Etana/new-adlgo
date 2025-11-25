import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingService } from './bidding.service';
import { BiddingGateway } from './bidding.gateway';
import { BiddingController } from './bidding.controller';
import { Bid } from './bid.entity';
import { Order } from '../orders/order.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Bid, Order]),
        AuthModule, // Import AuthModule to access AuthService
    ],
    providers: [BiddingService, BiddingGateway],
    controllers: [BiddingController],
    exports: [BiddingService],
})
export class BiddingModule { }
