import 'dotenv/config'
import express, {Request, Response} from "express";

import {db} from "./store/mockedDB";
import {HTTP_STATUSES} from "./types";
import {videosRouter} from "./routes/h01-videos/videos-router";
import {blogsRouter} from "./routes/h02-api/blogs-router";
import {postsRouter} from "./routes/h02-api/posts-router";
import {blogsCollection, postsCollection, runDB, videosCollection} from "./store/db";


const port = process.env.PORT || 3001;
const jsonMiddleware = express.json();

export const app = express();

app.use(jsonMiddleware);
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('main page')
});

// clear all resources data for testing, OMIT USERS!!
app.delete('/testing/all-data', async (req: Request, res: Response<void>) => {
    // deleting from mocked DB
    for (let property in db) {
        if (property.toString() !== 'users') {
            (db as any)[property] = [];
        }
    }

    // deleting from mongodb atlas
    await Promise.all([
        blogsCollection.deleteMany({}),
        postsCollection.deleteMany({}),
        videosCollection.deleteMany({})
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`server running on ${port} port`);
    });
}

startApp();
