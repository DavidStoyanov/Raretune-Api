import jwt from 'jsonwebtoken';

const secret = process.env.SECRET || 'TopSecret';

function createToken(data: object) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export {
    createToken,
    verifyToken
}