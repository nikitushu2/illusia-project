import { Request, Response, NextFunction } from 'express';
import { verifyAndParseJWT } from '../util/jwtUtils';
import { findByEmail } from '../services/userService';
import { ApplicationUser, UserRole } from '../types/applicationUser';
import jwt from 'jsonwebtoken';
import { SESSION_COOKIE_NAME } from '../util/cookieUtils';

export interface RequestWithSession extends Request {
    applicationUser?: ApplicationUser; 
}

export const verifySession = async (req: RequestWithSession, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies[SESSION_COOKIE_NAME] // Get the cookie named 'session'
        
        if (!token) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }

        const sessionUser = verifyAndParseJWT(token);
        if (sessionUser) {
            // verify the user details from db to get instant approval status
            const applicationUser = await findByEmail(sessionUser.email);
            if (!applicationUser || !applicationUser.isApproved) {
                res.status(401).json({ message: 'Unauthorized User' });
                return;
            }
            // Attach the applicationUser to the request object
            req.applicationUser = applicationUser;
        } else {
            res.status(401).json({ message: 'Invalid session token' });
            return;
        }
        
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid session token' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const verifySuperAdminSession = (req: RequestWithSession, res: Response, next: NextFunction): void => {
    const applicationUser = req.applicationUser;
    if (!applicationUser || applicationUser.role === UserRole.ADMIN || applicationUser.role === UserRole.USER) {
        res.status(401).json({ message: 'Only Authorized for super admins' });
        return;
    }
    next();
};

export const verifyAdminSession = (req: RequestWithSession, res: Response, next: NextFunction): void => {
        const applicationUser = req.applicationUser;
        //! mark kyu lagaye
        if (!applicationUser || applicationUser.role === UserRole.USER) {
            res.status(401).json({ message: 'Only Authorized for admins' });
            return;
        }
        next();
};
