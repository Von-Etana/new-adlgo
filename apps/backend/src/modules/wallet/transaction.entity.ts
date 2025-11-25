import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 12, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ['credit', 'debit'] })
    type: 'credit' | 'debit';

    @Column({ type: 'enum', enum: ['deposit', 'withdrawal', 'payment', 'commission', 'earnings', 'bill_payment'] })
    category: string;

    @Column({ nullable: true })
    reference: string; // e.g., Paystack ref or Order ID

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet: Wallet;

    @CreateDateColumn()
    createdAt: Date;
}
