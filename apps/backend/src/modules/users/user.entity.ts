import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, Index } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    phone: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ select: false, nullable: true }) // Select false to hide by default
    password: string;

    @Column({ type: 'enum', enum: ['customer', 'driver', 'admin'], default: 'customer' })
    @Index()
    role: string;

    // Driver specific fields
    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: false })
    isOnline: boolean;

    @Column({ type: 'jsonb', nullable: true })
    vehicleDetails: {
        type: 'bike' | 'car' | 'van' | 'truck';
        brand: string;
        model: string;
        plateNumber: string;
    };

    @OneToOne(() => Wallet, (wallet) => wallet.user)
    wallet: Wallet;

    @CreateDateColumn()
    createdAt: Date;
}
