import express, { Application } from "express";
import cors from 'cors';

import CONFIG from "./configuration/config";
import { DB } from "./configuration/database";
import { configureExpress } from "./configuration/express";
import { errorHandler } from "./utils/error-handler";

import routerApi from './routes/index'; 

(async () => {
    const app: Application = express();

    //Database setup
    await DB.connection();

    //Express setup
    configureExpress(app);

    app.use(cors({
        origin: CONFIG.ENV.ORIGIN,
        credentials: true
    }));

    //Middlewares

    //Routes
    app.use("", routerApi);

    //Error
    app.use(errorHandler);

    //Spin-up
    app.listen(CONFIG.ENV.PORT, () =>
        console.log(`Listening on port ${CONFIG.ENV.PORT}!`)
    );
})();




