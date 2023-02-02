import {runDB} from "./store/db";
import {app} from "./app";
import * as dotenv from "dotenv";


dotenv.config();
const port = process.env.PORT || 3001;

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`server running on ${port} port`);
    });
}

startApp();
