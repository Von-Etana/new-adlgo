import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Bid } from '../bidding/bid.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User) // Customer
    customer: User;

    @ManyToOne(() => User, { nullable: true }) // Assigned Driver
    driver: User;

    @Column()
    pickupAddress: string;

    @Column({ type: 'jsonb' })
    pickupCoordinates: { lat: number; lng: number };

    @Column()
    dropoffAddress: string;

    @Column({ type: 'jsonb' })
    dropoffCoordinates: { lat: number; lng: number };

    @Column('decimal', { precision: 10, scale: 2 })
    offerPrice: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    finalPrice: number;

    @Column({ type: 'enum', enum: ['pending', 'bidding', 'accepted', 'in_transit', 'delivered', 'cancelled'], default: 'pending' })
    status: string;

    @Column({ nullable: true })
    proofOfDeliveryUrl: string;

    @OneToMany(() => Bid, (bid) => bid.order)
    bids: Bid[];

    @CreateDateColumn()
    createdAt: Date;
}
