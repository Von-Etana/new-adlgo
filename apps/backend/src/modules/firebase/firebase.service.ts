import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);

    onModuleInit() {
        if (!admin.apps.length) {
            // In production, use process.env.FIREBASE_CREDENTIALS
            // For dev, we can use a placeholder or local file
            try {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    // databaseURL: "https://your-project.firebaseio.com"
                });
                this.logger.log('Firebase Admin initialized successfully');
            } catch (error) {
                this.logger.warn(`Firebase Admin initialization failed (expected if no credentials provided): ${error.message}`);
            }
        }
    }

    getAuth() {
        return admin.auth();
    }

    getFirestore() {
        return admin.firestore();
    }

    getDatabase() {
        return admin.database();
    }
}
