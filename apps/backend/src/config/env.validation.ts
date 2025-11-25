import { plainToInstance } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsString()
    @IsNotEmpty()
    FLUTTERWAVE_PUBLIC_KEY: string;

    @IsString()
    @IsNotEmpty()
    FLUTTERWAVE_SECRET_KEY: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_APPLICATION_CREDENTIALS: string;

    @IsString()
    PORT: string = '3000';

    @IsString()
    ALLOWED_ORIGINS: string = 'http://localhost:8081,http://localhost:19006';
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        const missingVars = errors.map((error) => Object.keys(error.constraints || {})).flat();
        throw new Error(
            `Environment validation failed! Missing or invalid variables:\n${errors
                .map((err) => `  - ${err.property}: ${Object.values(err.constraints || {}).join(', ')}`)
                .join('\n')}`
        );
    }

    return validatedConfig;
}
