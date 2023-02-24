import {Request, Response} from "express";
import {constants} from "http2";

import {db} from "../store/mockedDB";
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    usersCollection,
    videosCollection
} from "../store/db";


export const testingControllers = {
    async deleteAllData(
        req: Request,
        res: Response<void>
    ) {
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
            usersCollection.deleteMany({}),
            commentsCollection.deleteMany({})
        ]);

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    }
};
