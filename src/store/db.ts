import 'dotenv/config';
import {MongoClient} from 'mongodb';

import {GetBlogOutputModel} from "../models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModel} from "../models/PostModels/GetPostOutputModel";
import {GetVideoOutputModel} from "../models/VideoModels/GetVideoOutputModel";


const mongoUri = process.env.MONGOURI || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoUri);

const db01 = client.db("It-incubator-01")

export const blogsCollection = db01.collection<GetBlogOutputModel>("blogs");
export const postsCollection = db01.collection<GetPostOutputModel>("posts");
export const videosCollection = db01.collection<GetVideoOutputModel>("videos");

export const runDB = async () => {
    try {
        // connect the client to server
        await client.connect();
        // Establish and verify connection
        await client.db("test").command({ping: 1});
        console.log('Connected successfully to mongo server')
    } catch {
        console.error('Error connection to mongodb is occurred')
        await client.close();
    }
}

