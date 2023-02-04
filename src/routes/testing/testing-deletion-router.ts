import {Request, Response, Router} from "express";

import {HTTP_STATUSES} from "../../types";
import {db} from "../../store/mockedDB";
import {blogsCollection, postsCollection, usersCollection, videosCollection} from "../../store/db";


export const testingDeletionRouter = Router({});

// clear all resources data for testing, OMIT USERS in mocked db!!
testingDeletionRouter.delete('/all-data', async (req: Request, res: Response<void>) => {
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
        videosCollection.deleteMany({}),
        usersCollection.deleteMany(({}))
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
