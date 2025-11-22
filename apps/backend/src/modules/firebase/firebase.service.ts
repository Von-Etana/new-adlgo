import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    onModuleInit() {
        if (!admin.apps.length) {
            // In production, use process.env.FIREBASE_CREDENTIALS
            // For dev, we can use a placeholder or local file
            try {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    // databaseURL: "https://your-project.firebaseio.com"
                });
                console.log('Firebase Admin Initialized');
            } catch (error) {
                console.warn('Firebase Admin Init Failed (Expected if no creds provided):', error.message);
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
