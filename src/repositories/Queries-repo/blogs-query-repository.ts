import {ObjectId} from "mongodb";

import {blogsCollection, postsCollection} from '../../store/db';
import {GetBlogOutputModelFromMongoDB} from "../../models/BlogModels/GetBlogOutputModel";
import {SortDirections, GetBlogsArgs, GetPostsArgs, GetPostsInBlogArgs} from "../../types";
import {calculateAndGetSkipValue} from "../../helpers";
import {GetPostOutputModelFromMongoDB} from "../../models/PostModels/GetPostOutputModel";


export const blogsQueryRepository = {
    async getBlogs({
                       searchNameTerm,
                       sortBy,
                       sortDirection,
                       pageNumber,
                       pageSize
                   }
                       : GetBlogsArgs): Promise<GetBlogOutputModelFromMongoDB[]> {
        try {
            const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {};
            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            return await blogsCollection
                .find(filter)
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
        } catch (error) {
            console.log(`BlogsQueryRepository get blogs error is occurred: ${error}`);
            return [];
        }
    },

    async getPostsInBlog({
                             blogId,
                             sortBy,
                             sortDirection,
                             pageNumber,
                             pageSize
                         }: GetPostsInBlogArgs): Promise<GetPostOutputModelFromMongoDB[]> {
        try {
            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            return await postsCollection
                .find({blogId: {$regex: blogId}})
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
        } catch (error) {
            console.log(`BlogsQueryRepository.getPostsInBlog error is occurred: ${error}`);
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
