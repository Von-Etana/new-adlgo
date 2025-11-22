import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    balance: number;

    @Column({ default: 'NGN' })
    currency: string;

    @OneToOne(() => User, (user) => user.wallet)
    @JoinColumn()
    user: User;

    @OneToMany(() => Transaction, (tx) => tx.wallet)
    transactions: Transaction[];
}
