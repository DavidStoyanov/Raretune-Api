import mongoose from 'mongoose';

import CONFIG from './config';

export class DB {
    static async connection() {
        try {
            await mongoose.connect(CONFIG.ENV.DB_URL, {});
            console.log("DB Connected Successfully!");
        } catch (err) {
            console.error("DB Connection Failed!");
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }

};