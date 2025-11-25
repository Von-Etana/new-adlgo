import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @ManyToOne(() => User)
    user: User;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
