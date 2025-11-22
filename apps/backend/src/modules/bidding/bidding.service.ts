import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BiddingService {
    // Mock DB for MVP
    private orders = new Map();
    private bids = new Map();

    async createOrder(data: any) {
        const order = {
            id: uuidv4(),
            ...data,
            status: 'bidding',
            createdAt: new Date(),
            bids: [],
        };
        this.orders.set(order.id, order);
        return order;
    }

    async placeBid(data: { orderId: string; driverId: string; amount: number }) {
        const bid = {
            id: uuidv4(),
            ...data,
            status: 'pending',
            createdAt: new Date(),
            // Mock driver details for UI
            driverDetails: {
                name: 'Musa Driver',
                rating: 4.8,
                vehicle: 'Toyota Camry',
                plate: 'ABC-123-XY',
            }
        };

        const order = this.orders.get(data.orderId);
        if (order) {
            order.bids.push(bid);
            this.bids.set(bid.id, bid);
        }

        return bid;
    }

    async acceptBid(data: { orderId: string; bidId: string; driverId: string }) {
        const order = this.orders.get(data.orderId);
        if (!order) throw new Error('Order not found');

        order.status = 'accepted';
        order.driverId = data.driverId;
        order.finalPrice = this.bids.get(data.bidId)?.amount || order.offerPrice;

        return order;
    }
}
