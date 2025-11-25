import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Log the error
        this.logger.error(
            `HTTP ${status} Error Path: ${request.url}`,
            exception instanceof Error ? exception.stack : exception
        );

        // Send sanitized error response
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : (message as any).message || 'An error occurred',
            ...(process.env.NODE_ENV === 'development' && {
                error: exception instanceof Error ? exception.message : exception,
                stack: exception instanceof Error ? exception.stack : undefined,
            }),
        });
    }
}
