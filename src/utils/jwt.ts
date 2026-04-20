import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = process.env.SECRET || 'TopSecret';

function createToken(data: object) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token: string): Promise<string | JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data as string | JwtPayload);
        });
    });
}

export {
    createToken,
    verifyToken
}