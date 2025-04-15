import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { ApplicationUser } from '../types/applicationUser';


const JWT_PRIVATE_KEY = config.auth.jwtPrivateKey;
const JWT_PUBLIC_KEY = config.auth.jwtPublicKey;
const JWT_ALGORITHM = 'RS256';
const JWT_EXPIRATION = '1h'; // 1 hour

export interface VerifiedJWT {
    user: ApplicationUser;
    isAboutToExpire: boolean;
}

export const signJWT = (applicationUser: ApplicationUser): string => {
    if (!JWT_PRIVATE_KEY || JWT_PRIVATE_KEY === '') {
        throw new Error('JWT_PRIVATE_KEY is not defined');
    }
    const payload = {
        payload: applicationUser
    }

    const options: jwt.SignOptions = {
        algorithm: JWT_ALGORITHM,
        expiresIn: JWT_EXPIRATION,
        issuer: config.backendOrigin, 
        audience: config.backendOrigin,
        subject: applicationUser.email,
    };

    try {
        return jwt.sign(payload, JWT_PRIVATE_KEY, options);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Error signing JWT: ${errorMessage}`);
    }
}

export const verifyAndParseJWT = (token: string): VerifiedJWT => {
    if (!JWT_PUBLIC_KEY || JWT_PUBLIC_KEY === '') {
        throw new Error('JWT_PUBLIC_KEY is not defined');
    }

    if (!token || token === '') {
        throw new Error('Token is required');
    }

    const options: jwt.VerifyOptions = {
        algorithms: [JWT_ALGORITHM],
        issuer: config.backendOrigin,
        audience: config.backendOrigin,
    };

    try {
        const decoded = jwt.verify(token, JWT_PUBLIC_KEY, options) as jwt.JwtPayload;
        const expiresAt = new Date(decoded.exp! * 1000); // Convert to milliseconds
        const isAboutToExpire = expiresAt.getTime() - Date.now() < 15 * 60 * 1000; // 15 minutes
        return {
            user: decoded.payload,
            isAboutToExpire: isAboutToExpire
        };
    } catch (error: unknown) {
        console.error('JWT verification error:', error);
        throw error instanceof Error ? error : new Error('Unknown error');
    }
}