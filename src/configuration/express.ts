import path from "path";
import express, { Application } from "express";
import cookieParser from "cookie-parser";

import CONFIG from "./config";
import { cookieSession } from "./cookie-session";

const cookieSecret = CONFIG.ENV.COOKIES_SECRET;

export function configureExpress(app: Application) {
    app.use(express.json());

    app.use(cookieParser(cookieSecret));

    app.use(cookieSession)

    app.use(express.static(path.resolve(__dirname, 'static')));
}