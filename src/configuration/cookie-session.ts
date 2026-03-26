import expressSession from 'express-session';

import CONFIG from "./config";

export const cookieSession = expressSession({
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})