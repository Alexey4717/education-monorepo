import * as dotenv from "dotenv";

import {SettingsType} from "./types/common";


dotenv.config();

export const settings: SettingsType = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || 'my_jwt_secret',
    DB_NAME: process.env.DB_NAME || "It-incubator-01"
};