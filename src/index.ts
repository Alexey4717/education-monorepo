import * as dotenv from "dotenv";
dotenv.config();

import express, {Request, Response, NextFunction} from "express";

import {runDB} from "./store/db";
import {authRouter} from "./application/routes/h05-api/auth-router";
import {videosRouter} from "./application/routes/h01-videos/videos-router";
import {blogsRouter} from "./application/routes/h02-api/blogs-router";
import {postsRouter} from "./application/routes/h02-api/posts-router";
import {testingDeletionRouter} from "./application/routes/testing/testing-deletion-router";
import {usersRouter} from "./application/routes/h05-api/users-router";
import {RequestContextType} from "./types/common";
import {commentsRouter} from "./application/routes/h06-comments/comments-router";


const jsonMiddleware = express.json();

export const index = express();

index.use(jsonMiddleware);
index.use((req: Request, res: Response, next: NextFunction) => {
    req.context = {} as RequestContextType;
    next();
})
index.use('/auth', authRouter);
index.use('/users', usersRouter);
index.use('/videos', videosRouter);
index.use('/blogs', blogsRouter);
index.use('/posts', postsRouter);
index.use('/comments', commentsRouter);
index.use('/testing', testingDeletionRouter);

index.get('/', (req: Request, res: Response) => {
    res.send('main page')
});

const port = process.env.PORT || 3001;

const startApp = async () => {
    await runDB();
    index.listen(port, () => {
        console.log(`server running on ${port} port`);
    });
}

startApp();
