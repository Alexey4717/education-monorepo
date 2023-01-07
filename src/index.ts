import express, {Request, Response} from "express";

import {db} from "./store/mockedDB";
import {HTTP_STATUSES} from "./types";
import {videosRouter} from "./routes/h01-videos/videos-router";


const PORT = process.env.PORT || 3001;
const jsonMiddleware = express.json();

export const app = express();

app.use(jsonMiddleware);
app.use('/videos', videosRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('main page')
});

// clear all resources data for testing
app.delete('/testing/all-data', (req: Request, res: Response<void>) => {
    db.videos = [];
    // add other router, when will be added in the future
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT} port`);
});
