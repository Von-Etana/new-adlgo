import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BiddingService } from '../bidding/bidding.service';
import { CreateOrderDto } from '../../common/dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly biddingService: BiddingService) { }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        // Reuse the bidding service logic to create an order
        return this.biddingService.createOrder(createOrderDto);
    }

    @Get(':id')
    async getOrder(@Param('id') id: string) {
        // Mock fetch
        return {
            id,
            status: 'pending',
            pickup: 'Wuse 2',
            dropoff: 'Gwarinpa',
            price: 1500,
        };
    }

    @Get('user/:userId')
    async getUserOrders(@Param('userId') userId: string) {
        return [
            { id: '1', date: '2025-11-20', pickup: 'Wuse', dropoff: 'Maitama', price: 1200, status: 'delivered' },
        ];
    }
}
