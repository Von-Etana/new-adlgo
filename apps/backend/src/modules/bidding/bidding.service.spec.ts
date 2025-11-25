import { Test, TestingModule } from '@nestjs/testing';
import { BiddingService } from './bidding.service';

describe('BiddingService', () => {
    let service: BiddingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BiddingService],
        }).compile();

        service = module.get<BiddingService>(BiddingService);
    });

    afterEach(() => {
        // Clear in-memory storage
        service['orders'].clear();
        service['bids'].clear();
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const orderData = {
                userId: 'user-123',
                pickup: { lat: 6.5244, lng: 3.3792, address: 'Lagos' },
                dropoff: { lat: 6.4541, lng: 3.3947, address: 'Ikeja' },
                offerPrice: 5000,
                type: 'Express' as const,
            };

            const result = await service.createOrder(orderData);

            expect(result).toHaveProperty('id');
            expect(result.status).toBe('bidding');
            expect(result.offerPrice).toBe(5000);
            expect(result.bids).toEqual([]);
        });
    });

    describe('placeBid', () => {
        it('should place a bid on an order', async () => {
            // First create an order
            const order = await service.createOrder({
                userId: 'user-123',
                pickup: { lat: 6.5244, lng: 3.3792, address: 'Lagos' },
                dropoff: { lat: 6.4541, lng: 3.3947, address: 'Ikeja' },
                offerPrice: 5000,
                type: 'Express',
            });

            const bidData = {
                orderId: order.id,
                driverId: 'driver-123',
                amount: 4500,
            };

            const result = await service.placeBid(bidData);

            expect(result).toHaveProperty('id');
            expect(result.amount).toBe(4500);
            expect(result.status).toBe('pending');
            expect(result.driverDetails).toBeDefined();
        });

        it('should add bid to order bids array', async () => {
            const order = await service.createOrder({
                userId: 'user-123',
                pickup: { lat: 6.5244, lng: 3.3792, address: 'Lagos' },
                dropoff: { lat: 6.4541, lng: 3.3947, address: 'Ikeja' },
                offerPrice: 5000,
                type: 'Express',
            });

            await service.placeBid({
                orderId: order.id,
                driverId: 'driver-123',
                amount: 4500,
            });

            const updatedOrder = service['orders'].get(order.id);
            expect(updatedOrder.bids).toHaveLength(1);
        });
    });

    describe('acceptBid', () => {
        it('should accept a bid and update order status', async () => {
            const order = await service.createOrder({
                userId: 'user-123',
                pickup: { lat: 6.5244, lng: 3.3792, address: 'Lagos' },
                dropoff: { lat: 6.4541, lng: 3.3947, address: 'Ikeja' },
                offerPrice: 5000,
                type: 'Express',
            });

            const bid = await service.placeBid({
                orderId: order.id,
                driverId: 'driver-123',
                amount: 4500,
            });

            const result = await service.acceptBid({
                orderId: order.id,
                bidId: bid.id,
                driverId: 'driver-123',
            });

            expect(result.status).toBe('accepted');
            expect(result.driverId).toBe('driver-123');
            expect(result.finalPrice).toBe(4500);
        });

        it('should throw error if order not found', async () => {
            await expect(
                service.acceptBid({
                    orderId: 'non-existent',
                    bidId: 'bid-123',
                    driverId: 'driver-123',
                })
            ).rejects.toThrow('Order not found');
        });
    });
});
