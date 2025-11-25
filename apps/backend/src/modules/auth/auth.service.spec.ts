import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let sessionRepository: Repository<Session>;

    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockSessionRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(Session),
                    useValue: mockSessionRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        sessionRepository = module.get<Repository<Session>>(getRepositoryToken(Session));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const registerDto = {
                phone: '+2348012345678',
                password: 'password123',
                role: 'customer',
                fullName: 'Test User',
            };

            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(registerDto);
            mockUserRepository.save.mockResolvedValue({ id: '123', ...registerDto });

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('id');
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { phone: registerDto.phone },
            });
            expect(mockUserRepository.save).toHaveBeenCalled();
        });

        it('should throw BadRequestException if user already exists', async () => {
            const registerDto = {
                phone: '+2348012345678',
                password: 'password123',
            };

            mockUserRepository.findOne.mockResolvedValue({ id: '123' });

            await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });

        it('should hash password before saving', async () => {
            const registerDto = {
                phone: '+2348012345678',
                password: 'password123',
            };

            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockImplementation((data) => data);
            mockUserRepository.save.mockImplementation((user) => Promise.resolve(user));

            await service.register(registerDto);

            const savedUser = mockUserRepository.save.mock.calls[0][0];
            expect(savedUser.password).not.toBe('password123');
            expect(savedUser.password).toBeDefined();
        });
    });

    describe('login', () => {
        it('should successfully login with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: '123',
                phone: '+2348012345678',
                password: hashedPassword,
                role: 'customer',
                fullName: 'Test User',
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockSessionRepository.create.mockImplementation((data) => data);
            mockSessionRepository.save.mockImplementation((session) => Promise.resolve(session));

            const result = await service.login('+2348012345678', 'password123');

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user.id).toBe('123');
            expect(mockSessionRepository.save).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException for invalid phone', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.login('+2348012345678', 'password123')).rejects.toThrow(
                UnauthorizedException
            );
        });

        it('should throw UnauthorizedException for invalid password', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: '123',
                phone: '+2348012345678',
                password: hashedPassword,
                role: 'customer',
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.login('+2348012345678', 'wrongpassword')).rejects.toThrow(
                UnauthorizedException
            );
        });

        it('should throw UnauthorizedException if password is required but not provided', async () => {
            const mockUser = {
                id: '123',
                phone: '+2348012345678',
                password: 'hashedpassword',
                role: 'customer',
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.login('+2348012345678')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateSession', () => {
        it('should return user for valid session', async () => {
            const mockUser = {
                id: '123',
                phone: '+2348012345678',
                role: 'customer',
            };

            const mockSession = {
                token: 'valid-token',
                user: mockUser,
                expiresAt: new Date(Date.now() + 86400000), // Tomorrow
            };

            mockSessionRepository.findOne.mockResolvedValue(mockSession);

            const result = await service.validateSession('valid-token');

            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException for expired session', async () => {
            const mockSession = {
                token: 'expired-token',
                user: { id: '123' },
                expiresAt: new Date(Date.now() - 86400000), // Yesterday
            };

            mockSessionRepository.findOne.mockResolvedValue(mockSession);

            await expect(service.validateSession('expired-token')).rejects.toThrow(
                UnauthorizedException
            );
        });

        it('should throw UnauthorizedException for invalid token', async () => {
            mockSessionRepository.findOne.mockResolvedValue(null);

            await expect(service.validateSession('invalid-token')).rejects.toThrow(
                UnauthorizedException
            );
        });
    });
});
