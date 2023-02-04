import express, {Request, Response} from "express";

import {authRouter} from "./routes/h05-api/auth-router";
import {videosRouter} from "./routes/h01-videos/videos-router";
import {blogsRouter} from "./routes/h02-api/blogs-router";
import {postsRouter} from "./routes/h02-api/posts-router";
import {testingDeletionRouter} from "./routes/testing/testing-deletion-router";
import {usersRouter} from "./routes/h05-api/users-router";


const jsonMiddleware = express.json();

export const app = express();

app.use(jsonMiddleware);
app.use('/auth', authRouter);
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/testing', testingDeletionRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('main page')
});
