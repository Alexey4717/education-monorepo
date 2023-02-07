import {MongoClient} from 'mongodb';

import {GetBlogOutputModel} from "../models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModel} from "../models/PostModels/GetPostOutputModel";
import {GetVideoOutputModel} from "../models/VideoModels/GetVideoOutputModel";
import {GetUserOutputModel} from "../models/UserModels/GetUserOutputModel";
import {settings} from "../settings";


const mongoUri = settings.MONGO_URI;
const dbName = settings.DB_NAME;

const client = new MongoClient(mongoUri);

const db01 = client.db(dbName)

export const blogsCollection = db01.collection<GetBlogOutputModel>("blogs");
export const postsCollection = db01.collection<GetPostOutputModel>("posts");
export const videosCollection = db01.collection<GetVideoOutputModel>("videos");
export const usersCollection = db01.collection<GetUserOutputModel>("users");

export const runDB = async () => {
    try {
        await client.connect();
        await client.db("test").command({ping: 1});
        console.log('Connected successfully to mongo server')
    } catch {
        console.error('Error connection to mongodb is occurred')
        await client.close();
    }
}

