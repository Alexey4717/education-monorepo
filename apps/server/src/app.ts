import * as dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response, NextFunction, Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { authRouter } from './application/routes/h05-api/auth-router';
import { videosRouter } from './application/routes/h01-videos/videos-router';
import { blogsRouter } from './application/routes/h02-api/blogs-router';
import { postsRouter } from './application/routes/h02-api/posts-router';
import { testingDeletionRouter } from './application/routes/testing/testing-deletion-router';
import { usersRouter } from './application/routes/h05-api/users-router';
import { RequestContextType } from './types/common';
import { commentsRouter } from './application/routes/h06-comments/comments-router';
import { securityDevicesRouter } from './application/routes/h09-security-devices/security-devices-router';
import { specs } from './swagger';

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = [process.env.CLIENT_URL];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export const configApp = (app: Express) => {
    app.set('trust proxy', true);

    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.json());

    app.use((req: Request, res: Response, next: NextFunction) => {
        req.context = {} as RequestContextType;
        next();
    });
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/videos', videosRouter);
    app.use('/blogs', blogsRouter);
    app.use('/posts', postsRouter);
    app.use('/comments', commentsRouter);
    app.use('/security/devices', securityDevicesRouter);
    app.use('/testing', testingDeletionRouter);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.get('/', (req: Request, res: Response) => {
        res.send('main page');
    });
};
