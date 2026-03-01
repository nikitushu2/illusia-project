import { Router } from "express";
import { Request, Response } from "express";
import admin from "../config/firebase";
import { findByEmail, createUser } from "../services/userService";
import { setSessionCookie, clearSessionCookie } from "../util/cookieUtils";
import { signJWT } from "../util/jwtUtils";
import { UserRole } from "../types/applicationUser";



const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body as { token?: string };
    if (!token) {
        res.status(400).json({ error: 'Token is required' });
        return;
    }
    try {
        // Check if Firebase is initialized
        if (!admin.apps.length) {
            res.status(503).json({ error: 'Firebase authentication is not configured' });
            return;
        }
        // Verify Firebase ID token
        const decodeToken = await admin.auth().verifyIdToken(token);
        const { picture, email } = decodeToken;

        // Find the user in our DB
        const applicationUser = email ? await findByEmail(email) : null;

        if (applicationUser) {

            if (applicationUser.isApproved) {
                // Generate JWT
                const jwtToken = signJWT(applicationUser);
                // Set JWT in HTTP-only cookie
                setSessionCookie(res, jwtToken);
            }

            applicationUser.picture = picture;

            res.status(200).json(applicationUser);
            return;
        } else {
            res.status(404).json({ error: `No registered user found with email ${email}` });
            return;
        }
    } catch (error) {
        console.error('Firebase verification error:', error);
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
});

authRouter.post("/logout", (_: Request, res: Response) => {
    // Clear the session cookie to log the user out
    clearSessionCookie(res);
    res.status(204).end();
});


authRouter.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const { token, displayName, role } = req.body as { token?: string; displayName?: string; role?: string };
    if (!token || !displayName || !role) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    try {
        // Check if Firebase is initialized
        if (!admin.apps.length) {
            res.status(503).json({ message: 'Firebase authentication is not configured' });
            return;
        }
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email } = decodedToken;
        // check if user already exists
        const existingUser = await findByEmail(email!);
        if (existingUser) {
            // send conflict status back as the user already exists
            res.status(409).json({message: "User already exists" });
            return;
        }
        // Save the user in the db
        const savedUser = await createUser({
            email: email!,
            displayName,
            role: role as UserRole,
        });
        if (!savedUser) {
            res.status(500).json({ message: "Error creating user" });
            return;
        }
        // Send a response to the client
        res.status(201).json({
            message: "User registered successfully. Waiting for approval.",
            user: savedUser,
        });
        return;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/argument-error') {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        console.error('Error during signup:', error);
        res.status(500).json({ 
            message: "Error creating user",
        });
        return;
    }
});


export { authRouter };