import {ObjectId} from "mongodb";

import {blogsCollection} from '../../store/db';
import {GetBlogOutputModelFromMongoDB} from "../../models/BlogModels/GetBlogOutputModel";


export const blogsQueryRepository = {
    async getBlogs(): Promise<GetBlogOutputModelFromMongoDB[]> {
        try {
            return await blogsCollection.find({}).toArray();
        } catch (error) {
            console.log(`BlogsQueryRepository get blogs error is occurred: ${error}`);
            return [];
        }
    },

    async findBlogById(id: string): Promise<GetBlogOutputModelFromMongoDB | null> {
        try {
            const foundBlog = await blogsCollection.findOne({"_id": new ObjectId(id)});
            return foundBlog ?? null;
        } catch (error) {
            console.log(`BlogsQueryRepository find blog by id error is occurred: ${error}`);
            return null;
        }
    },
};
