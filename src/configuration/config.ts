/**
 * Define CONFIG as a typed record
 * 
 * type Env = keyof typeof CONFIG;
 * const env = (process.env.NODE_ENV as Env) || 'DEVELOPMENT';
 * CONFIG[env];
 * 
 */
const env = (process.env.NODE_ENV || 'DEVELOPMENT') as keyof typeof CONFIG;

interface Env {
    PORT: number,
    DB_URL: string,
    ORIGIN: Array<string>,
    COOKIES_SECRET: string,
}

const development: Env = {
    PORT: Number(process.env.PORT) || 3000,
    DB_URL: 'mongodb://localhost:27017/raretune',
    ORIGIN: ['http://localhost:5555', 'http://localhost:4200'],
    COOKIES_SECRET: 'drain'
};

const production: Env = {
    PORT: Number(process.env.PORT) || 3000,
    DB_URL: process.env.DB_URL || '',
    ORIGIN: [],
    COOKIES_SECRET: process.env.COOKIES_SECRET || 'drain',
}

export const CONFIG = {
    ENV_TYPE: process.env.NODE_ENV || 'DEVELOPMENT',
    ENV: {} as Env,
    DEVELOPMENT: development,
    PRODUCTION: production,
    B_CRYPT_ROUNDS: 10,
    JWT_SECRET: "j(*J2HE7E@!7JKJHJD(@jZasehs1N(HS1seh12434",
    SESSION_SECRET: "J(h1294(UH9j+_)JPZ)sd)da92AJE1aJ@AHSJP*081-0",
    AUTH_COOKIE_NAME: "auth",
    VALIDATE_DB_SCHEMA: false,
};

CONFIG.ENV = CONFIG[env] as Env;

export const ERROR_MSG = {
    //todo: export to auth model
    /* CONFIRM_PASS_NOT_MATCH: "Confirm password does not match!",
    USER_ALREADY_EXIST: "Email is taken!",
    INV_USER_OR_EMAIL: "Incorrect email or password!",
    INCORRECT_PASS: "Incorrect email or password!", */

    GENERAL: "Something went wrong! The problem will be fixed soon.",
}

export default CONFIG;