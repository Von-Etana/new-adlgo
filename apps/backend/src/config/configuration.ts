interface Configuration {
    flutterwave: {
        publicKey: string;
        secretKey: string;
    };
    firebase: {
        credentialPath: string;
    };
    database: {
        url: string;
    };
    nodeEnv: string;
}

export const configuration = (): Configuration => {
    const config: Configuration = {
        flutterwave: {
            publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
            secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
        },
        firebase: {
            credentialPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account-key.json',
        },
        database: {
            url: process.env.DATABASE_URL || '',
        },
        nodeEnv: process.env.NODE_ENV || 'development',
    };

    // Validate required environment variables
    const requiredEnvVars = [
        { key: 'FLUTTERWAVE_SECRET_KEY', value: config.flutterwave.secretKey },
        { key: 'DATABASE_URL', value: config.database.url },
    ];

    const missingVars = requiredEnvVars.filter(({ value }) => !value);

    if (missingVars.length > 0 && config.nodeEnv === 'production') {
        throw new Error(
            `Missing required environment variables: ${missingVars.map(v => v.key).join(', ')}`
        );
    }

    // Warn in development if variables are missing
    if (missingVars.length > 0 && config.nodeEnv === 'development') {
        console.warn(
            `⚠️  Warning: Missing environment variables: ${missingVars.map(v => v.key).join(', ')}`
        );
        console.warn('Using default values for development. This is NOT safe for production.');

        // Set development defaults
        if (!config.database.url) {
            config.database.url = 'postgres://postgres:postgres@localhost:5432/adlgo_dev';
        }
        if (!config.flutterwave.secretKey) {
            config.flutterwave.secretKey = 'FLWSECK_TEST-SANDBOX';
        }
        if (!config.flutterwave.publicKey) {
            config.flutterwave.publicKey = 'FLWPUBK_TEST-SANDBOX';
        }
    }

    return config;
};
