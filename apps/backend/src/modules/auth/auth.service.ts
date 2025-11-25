import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Session } from './session.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
    ) { }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async register(data: { phone: string; password?: string; role?: string; fullName?: string }) {
        const existingUser = await this.userRepository.findOne({ where: { phone: data.phone } });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const user = this.userRepository.create({
            phone: data.phone,
            password: data.password ? await this.hashPassword(data.password) : undefined,
            role: data.role || 'customer',
            fullName: data.fullName,
        });

        return this.userRepository.save(user);
    }

    async login(phone: string, password?: string) {
        const user = await this.userRepository.findOne({
            where: { phone },
            select: ['id', 'phone', 'password', 'role', 'fullName'] // Explicitly select password
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (password && user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
        } else if (password && !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        } else if (!password) {
            throw new UnauthorizedException('Password is required');
        }

        // Create Session
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const session = this.sessionRepository.create({
            token,
            user,
            expiresAt,
        });

        await this.sessionRepository.save(session);

        return {
            token,
            user: {
                id: user.id,
                phone: user.phone,
                role: user.role,
                fullName: user.fullName,
            },
        };
    }

    async validateSession(token: string): Promise<User> {
        const session = await this.sessionRepository.findOne({
            where: { token },
            relations: ['user'],
        });

        if (!session || session.expiresAt < new Date()) {
            throw new UnauthorizedException('Session expired or invalid');
        }

        return session.user;
    }
}
