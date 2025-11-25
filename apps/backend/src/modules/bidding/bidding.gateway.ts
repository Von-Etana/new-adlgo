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
import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateOrderDto, CreateBidDto, AcceptBidDto } from '../../common/dto';

@WebSocketGateway({ cors: true, namespace: '/bidding' })
export class BiddingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('BiddingGateway');

    constructor(
        private readonly biddingService: BiddingService,
        private readonly authService: AuthService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            // Extract token from handshake auth or query
            const token = client.handshake.auth?.token || client.handshake.query?.token as string;

            if (!token) {
                this.logger.warn(`Client ${client.id} attempted connection without token`);
                client.disconnect();
                return;
            }

            // Validate session
            const user = await this.authService.validateSession(token);

            // Store user info in socket data
            client.data.user = user;
            client.data.userId = user.id;
            client.data.role = user.role;

            this.logger.log(`Client connected: ${client.id} (User: ${user.id}, Role: ${user.role})`);

            // Auto-join user to their personal room
            client.join(`user_${user.id}`);

            // If driver, join driver pool
            if (user.role === 'driver') {
                client.join('drivers_available');
                this.logger.log(`Driver ${user.id} joined available pool`);
            }
        } catch (error) {
            this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
            client.emit('error', { message: 'Authentication failed' });
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }

    @SubscribeMessage('join_driver_room')
    handleDriverJoin(@ConnectedSocket() client: Socket, @MessageBody() driverId: string) {
        // Verify user is a driver
        if (client.data.role !== 'driver') {
            throw new UnauthorizedException('Only drivers can join driver pool');
        }

        client.join('drivers_available');
        this.logger.log(`Driver ${driverId} joined available pool`);
        return { event: 'joined', data: 'drivers_available' };
    }

    @SubscribeMessage('create_order')
    async handleCreateOrder(@MessageBody() data: CreateOrderDto, @ConnectedSocket() client: Socket) {
        // Ensure userId matches authenticated user
        if (data.userId !== client.data.userId) {
            throw new UnauthorizedException('Cannot create order for another user');
        }

        this.logger.log(`New Order from ${data.userId}: ${data.offerPrice}`);

        const order = await this.biddingService.createOrder(data);

        // 1. Notify Drivers within 5km (Mocked as broadcasting to 'drivers_available')
        this.server.to('drivers_available').emit('new_request', order);

        // 2. Join the client to the order room to receive bids
        client.join(`order_${order.id}`);

        return { event: 'order_created', data: order };
    }

    @SubscribeMessage('driver_bid')
    async handleDriverBid(@MessageBody() data: CreateBidDto, @ConnectedSocket() client: Socket) {
        // Verify user is a driver
        if (client.data.role !== 'driver') {
            throw new UnauthorizedException('Only drivers can place bids');
        }

        // Ensure driverId matches authenticated user
        if (data.driverId !== client.data.userId) {
            throw new UnauthorizedException('Cannot bid as another driver');
        }

        this.logger.log(`Driver ${data.driverId} bid ${data.amount} on order ${data.orderId}`);

        const bid = await this.biddingService.placeBid(data);

        // Notify the Customer
        this.server.to(`order_${data.orderId}`).emit('bid_received', bid);

        return { event: 'bid_placed', data: bid };
    }

    @SubscribeMessage('accept_bid')
    async handleAcceptBid(@MessageBody() data: AcceptBidDto, @ConnectedSocket() client: Socket) {
        // Verify user is a customer (only customers can accept bids)
        if (client.data.role === 'driver') {
            throw new UnauthorizedException('Drivers cannot accept bids');
        }

        this.logger.log(`Customer accepted bid ${data.bidId} for order ${data.orderId}`);

        const result = await this.biddingService.acceptBid(data);

        // Notify the specific Driver
        this.server.to(`user_${data.driverId}`).emit('bid_accepted', result);

        // Notify everyone else the order is taken (optional, to remove from feed)
        this.server.to('drivers_available').emit('order_taken', { orderId: data.orderId });

        return { event: 'order_finalized', data: result };
    }
}
