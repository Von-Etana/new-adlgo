import { Injectable, LoggerService as NestLoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: winston.Logger;
    private context?: string;

    constructor(context?: string) {
        this.context = context;

        const logLevel = process.env.LOG_LEVEL || 'info';
        const nodeEnv = process.env.NODE_ENV || 'development';

        this.logger = winston.createLogger({
            level: logLevel,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: 'adlgo-backend', context: this.context },
            transports: [
                // Console transport
                new winston.transports.Console({
                    format: nodeEnv === 'development'
                        ? winston.format.combine(
                            winston.format.colorize(),
                            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                                const ctx = context ? `[${context}]` : '';
                                const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                                return `${timestamp} ${level} ${ctx} ${message} ${metaStr}`;
                            })
                        )
                        : winston.format.json(),
                }),
                // File transports for production
                ...(nodeEnv === 'production' ? [
                    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                    new winston.transports.File({ filename: 'logs/combined.log' }),
                ] : []),
            ],
        });
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context: context || this.context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { trace, context: context || this.context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context: context || this.context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context: context || this.context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context: context || this.context });
    }

    // NestJS LoggerService interface methods
    setLogLevels(levels: LogLevel[]) {
        // Winston doesn't support this directly, but we can adjust the level
        if (levels.includes('error')) {
            this.logger.level = 'error';
        } else if (levels.includes('warn')) {
            this.logger.level = 'warn';
        } else if (levels.includes('log')) {
            this.logger.level = 'info';
        } else if (levels.includes('debug')) {
            this.logger.level = 'debug';
        } else if (levels.includes('verbose')) {
            this.logger.level = 'verbose';
        }
    }
}
