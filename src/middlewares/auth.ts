import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import CONFIG from "../configuration/config";
import * as jwt from '../utils/jwt';
import User, { IUser }  from '../features/users/user';
import TokenBlacklist from "../models/token-blacklist";

//todo: create user for req

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies[CONFIG.AUTH_COOKIE_NAME] || '';
    Promise.all([ //<[string | JwtPayload, Record<string, object>]>
        jwt.verifyToken(token),
        TokenBlacklist.findOne({ token })
    ])
        .then(([data, blacklistedToken]) => {
            if (blacklistedToken) {
                return Promise.reject(new Error('blacklisted token'));
            }

            if (typeof data === "string") {
                return Promise.reject(new Error("unexpected string token payload"));
            }

            User.findById(data.id)
                .then(user => {
                    req.user = user as unknown as IUser;
                    req.isLogged = true;
                    next();
                })
        })
        .catch(err => {
            if (['token expired', 'blacklisted token', 'jwt must be provided', 'unexpected string token payload'].includes(err.message)) {
                console.error(err);
                res
                    .status(401)
                    .send({ message: "Invalid token!" });
                return;
            }
            next(err);
        });
}