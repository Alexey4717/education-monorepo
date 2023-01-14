import express, {Request, Response} from "express";

import {db} from "./store/mockedDB";
import {HTTP_STATUSES} from "./types";
import {videosRouter} from "./routes/h01-videos/videos-router";
import {blogsRouter} from "./routes/h02-api/blogs-router";
import {postsRouter} from "./routes/h02-api/posts-router";


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
app.delete('/testing/all-data', (req: Request, res: Response<void>) => {
    for (let property in db) {
        if (property.toString() !== 'users') {
            (db as any)[property] = [];
        }
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
    console.log(`server running on ${port} port`);
});
