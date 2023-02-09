import * as dotenv from "dotenv";
dotenv.config();

import {runDB} from "./store/db";
import express from "express";
import {configApp} from "./app";

export const app = express();

configApp(app);

const port = process.env.PORT || 3001;

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`server running on ${port} port`);
    });
}

startApp();
