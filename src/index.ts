import * as dotenv from 'dotenv';
import express, {Request, Response} from "express";

import {videosRouter} from "./routes/h01-videos/videos-router";
import {blogsRouter} from "./routes/h02-api/blogs-router";
import {postsRouter} from "./routes/h02-api/posts-router";
import {blogsCollection, postsCollection, runDB, videosCollection} from "./store/db";
import {testingDeletionRouter} from "./routes/testing/testing-deletion-router";


dotenv.config();
const port = process.env.PORT || 3001;
const jsonMiddleware = express.json();

export const app = express();

app.use(jsonMiddleware);
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingDeletionRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('main page')
});

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`server running on ${port} port`);
    });
}

startApp();
