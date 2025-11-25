import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    // Enable CORS with specific origins
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081', 'http://localhost:19006'],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
        transform: true, // Automatically transform payloads to DTO instances
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle('ADLgo API')
        .setDescription('ADLgo Super App - Delivery & Bidding Platform API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('orders', 'Order management')
        .addTag('bidding', 'Bidding system')
        .addTag('wallet', 'Wallet and payments')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
