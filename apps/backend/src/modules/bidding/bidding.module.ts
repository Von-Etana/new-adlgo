import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { BiddingService } from './bidding.service';
import { BiddingGateway } from './bidding.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Bid])],
    providers: [BiddingGateway, BiddingService],
    exports: [BiddingService],
})
export class BiddingModule { }
