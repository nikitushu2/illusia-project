import { Router } from "express";
import { Request, Response } from "express";
import admin from "../config/firebase";
import { findByEmail } from "../services/userService";
import { setSessionCookie } from "../util/cookieUtils";
import { signJWT } from "../util/jwtUtils";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        // Verify Firebase ID token
        const decodeToken = await admin.auth().verifyIdToken(token);
        const { picture, email } = decodeToken;

        // Find the user in our DB
        const applicationUser = email ? await findByEmail(email) : null;

        if (applicationUser) {
            // Generate JWT
            const jwtToken = signJWT(applicationUser);
            applicationUser.picture = picture;

            // Set JWT in HTTP-only cookie
            setSessionCookie(res, jwtToken);

            res.status(200).json(applicationUser);
        } else {
            res.status(404).json({ error: `No registered user found with email ${email}` });
        }
    } catch (error) {
        console.error('Firebase verification error:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});

export { router };