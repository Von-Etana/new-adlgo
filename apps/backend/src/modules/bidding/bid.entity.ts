import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.bids)
    order: Order;

    @ManyToOne(() => User) // Driver
    driver: User;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
