import { Request, Response, NextFunction } from "express";

import * as jwt from '../../utils/jwt';
import CONFIG from "../../configuration/config";
import User, { IUser }  from './user';
import TokenBlacklist from "../../models/token-blacklist";

const bsonToJson = (data: object) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data: IUser): IUser => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, __v, ...userData } = data;
    return userData as IUser;
}

function register(req: Request, res: Response, next: NextFunction) {
    const { email, username, password } = req.body;

    User.create({ email, username, password })
        .then((createdUser: Record<string, object>) => {
            createdUser = bsonToJson(createdUser) as Record<string, object>;

            let u = createdUser as unknown as IUser;
            u = removePassword(u as unknown as IUser); 

            const token = jwt.createToken({ id: u.id });

            if (process.env.NODE_ENV === 'production') {
                res.cookie(CONFIG.AUTH_COOKIE_NAME, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(CONFIG.AUTH_COOKIE_NAME, token, { httpOnly: true })
            }

            res.status(200).send(u);
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(409)
                    .send({ message: `This ${field} is already registered!` });
                return;
            }
            next(err);
        });

}


function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    User.findOne({ email })
        .then((user): Promise<[IUser | null, boolean]> => {
            const u = user as IUser | null;
            return Promise.all([u, u ? u.matchPassword(password) : false])
        })
        .then(([user, match]: [IUser | null, boolean]) => {
            if (!match || !user) {
                res.status(401).send({ message: 'Wrong email or password' });
                return;
            }

            user = bsonToJson(user);
            user = removePassword(user as IUser);

            const token = jwt.createToken({ id: user.id });

            if (process.env.NODE_ENV === 'production') {
                res.cookie(CONFIG.AUTH_COOKIE_NAME, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(CONFIG.AUTH_COOKIE_NAME, token, { httpOnly: true })
            }

            res.status(200).send(user);
        })
        .catch(next);
}

function logout(req: Request, res: Response) {
    const token = req.cookies[CONFIG.AUTH_COOKIE_NAME];

    if (!token) {
        res.status(400).send({ message: 'Missing auth error' });
        return;
    }

    TokenBlacklist.create({ token })
        .then(() => {
            res.clearCookie(CONFIG.AUTH_COOKIE_NAME)
                .status(204)
                .send({ message: 'Logged out!' });
        })
        .catch(err => res.send(err));
}


export {
    register,
    login,
    logout,
}