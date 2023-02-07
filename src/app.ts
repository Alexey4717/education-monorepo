import express, {Request, Response} from "express";

import {authRouter} from "./application/routes/h05-api/auth-router";
import {videosRouter} from "./application/routes/h01-videos/videos-router";
import {blogsRouter} from "./application/routes/h02-api/blogs-router";
import {postsRouter} from "./application/routes/h02-api/posts-router";
import {testingDeletionRouter} from "./application/routes/testing/testing-deletion-router";
import {usersRouter} from "./application/routes/h05-api/users-router";
import {RequestContextType} from "./types/common";


const jsonMiddleware = express.json();

export const app = express();

app.use(jsonMiddleware);
app.use((req, res, next) => {
    req.context = new Object() as RequestContextType;
    next();
})
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingDeletionRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('main page')
});
