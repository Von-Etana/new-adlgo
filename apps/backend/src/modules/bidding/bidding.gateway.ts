import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BiddingService } from './bidding.service';
import { Logger } from '@nestjs/common';

interface CreateOrderDto {
    userId: string;
    pickup: { lat: number; lng: number; address: string };
    dropoff: { lat: number; lng: number; address: string };
    offerPrice: number;
    type: 'Express' | 'Standard';
}

interface BidDto {
    orderId: string;
    driverId: string;
    amount: number;
}

interface AcceptBidDto {
    orderId: string;
    bidId: string;
    driverId: string;
}

@WebSocketGateway({ cors: true, namespace: '/bidding' })
export class BiddingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('BiddingGateway');

    constructor(private readonly biddingService: BiddingService) { }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        // In a real app, verify token here and join user/driver specific rooms
        // client.join(`user_${userId}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_driver_room')
    handleDriverJoin(@ConnectedSocket() client: Socket, @MessageBody() driverId: string) {
        // Drivers join a room based on their geohash or simply 'drivers' for this MVP
        client.join('drivers_available');
        this.logger.log(`Driver ${driverId} joined available pool`);
        return { event: 'joined', data: 'drivers_available' };
    }

    @SubscribeMessage('create_order')
    async handleCreateOrder(@MessageBody() data: CreateOrderDto, @ConnectedSocket() client: Socket) {
        this.logger.log(`New Order from ${data.userId}: ${data.offerPrice}`);

        const order = await this.biddingService.createOrder(data);

        // 1. Notify Drivers within 5km (Mocked as broadcasting to 'drivers_available')
        this.server.to('drivers_available').emit('new_request', order);

        // 2. Join the client to the order room to receive bids
        client.join(`order_${order.id}`);

        return { event: 'order_created', data: order };
    }

    @SubscribeMessage('driver_bid')
    async handleDriverBid(@MessageBody() data: BidDto) {
        this.logger.log(`Driver ${data.driverId} bid ${data.amount} on order ${data.orderId}`);

        const bid = await this.biddingService.placeBid(data);

        // Notify the Customer
        this.server.to(`order_${data.orderId}`).emit('bid_received', bid);

        return { event: 'bid_placed', data: bid };
    }

    @SubscribeMessage('accept_bid')
    async handleAcceptBid(@MessageBody() data: AcceptBidDto) {
        this.logger.log(`Customer accepted bid ${data.bidId} for order ${data.orderId}`);

        const result = await this.biddingService.acceptBid(data);

        // Notify the specific Driver
        // In production, we'd map driverId to socketId or have drivers join `driver_${driverId}`
        this.server.emit(`bid_accepted_${data.driverId}`, result);

        // Notify everyone else the order is taken (optional, to remove from feed)
        this.server.to('drivers_available').emit('order_taken', { orderId: data.orderId });

        return { event: 'order_finalized', data: result };
    }
}
