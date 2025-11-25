"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
var configuration = function () { return ({
    flutterwave: {
        publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOX',
        secretKey: process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_TEST-SANDBOX',
    },
    firebase: {
        credentialPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account-key.json',
    },
    database: {
        url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/adlgo',
    }
}); };
exports.configuration = configuration;
