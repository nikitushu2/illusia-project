import { Response } from "express";

export const SESSION_COOKIE_NAME = 'session_token';
const SESSION_COOKIE_MAX_AGE = 3600000; // 1 hour

export const setSessionCookie = (res: Response, token: string): void => {
    res.cookie(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // use true in production
        sameSite: undefined,
        maxAge: SESSION_COOKIE_MAX_AGE,
    });
};