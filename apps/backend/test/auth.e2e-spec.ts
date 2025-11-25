import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth E2E Tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/register (POST)', () => {
        it('should register a new user', () => {
            const registerDto = {
                phone: `+234${Math.floor(Math.random() * 10000000000)}`,
                password: 'testpassword123',
                role: 'customer',
                fullName: 'Test User',
            };

            return request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.phone).toBe(registerDto.phone);
                });
        });

        it('should reject registration with existing phone', async () => {
            const registerDto = {
                phone: '+2348012345678',
                password: 'testpassword123',
            };

            // First registration
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto);

            // Second registration with same phone
            return request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(400);
        });

        it('should reject invalid phone format', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    phone: 'invalid-phone',
                    password: 'test123',
                })
                .expect(400);
        });
    });

    describe('/auth/login (POST)', () => {
        const testUser = {
            phone: `+234${Math.floor(Math.random() * 10000000000)}`,
            password: 'testpassword123',
        };

        beforeAll(async () => {
            // Register test user
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(testUser);
        });

        it('should login with valid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body).toHaveProperty('user');
                    expect(res.body.user.phone).toBe(testUser.phone);
                });
        });

        it('should reject login with invalid password', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    phone: testUser.phone,
                    password: 'wrongpassword',
                })
                .expect(401);
        });

        it('should reject login with non-existent phone', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    phone: '+2349999999999',
                    password: 'test123',
                })
                .expect(401);
        });
    });
});
