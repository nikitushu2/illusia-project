import admin from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config();

// Only initialize Firebase if all required credentials are present
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID_DEV;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL_DEV;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_DEV)?.replace(/\\n/g, '\n');

if (projectId && clientEmail && privateKey) {
    const serviceAccount = {
        projectId,
        clientEmail,
        privateKey,
    };

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
    }
} else {
    console.warn('Firebase credentials not found. Firebase Admin will not be initialized.');
    console.warn('Required environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
}

export default admin;