import {ObjectId} from "mongodb";

import {blogsCollection, postsCollection} from '../../store/db';
import {GetBlogOutputModelFromMongoDB} from "../../models/BlogModels/GetBlogOutputModel";
import {SortDirections, GetBlogsArgs, GetPostsArgs, GetPostsInBlogArgs, CommonResponse} from "../../types";
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
                       : GetBlogsArgs): Promise<CommonResponse<GetBlogOutputModelFromMongoDB[]>> {
        try {
            const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {};
            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            const items = await blogsCollection
                .find(filter)
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
            const totalCount = await blogsCollection.countDocuments(filter, {});
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                page: pageNumber,
                pageSize,
                totalCount,
                pagesCount,
                items
            }
        } catch (error) {
            console.log(`BlogsQueryRepository get blogs error is occurred: ${error}`);
            return {} as CommonResponse<GetBlogOutputModelFromMongoDB[]>;
        }
    },

    async getPostsInBlog({
                             blogId,
                             sortBy,
                             sortDirection,
                             pageNumber,
                             pageSize
                         }: GetPostsInBlogArgs): Promise<CommonResponse<GetPostOutputModelFromMongoDB[]>> {
        try {
            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            const filter = {blogId: {$regex: blogId}}
            const items = await postsCollection
                .find(filter)
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
            const totalCount = await blogsCollection.countDocuments(filter, {});
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                page: pageNumber,
                pageSize,
                totalCount,
                pagesCount,
                items
            }
        } catch (error) {
            console.log(`BlogsQueryRepository.getPostsInBlog error is occurred: ${error}`);
            return {} as CommonResponse<GetPostOutputModelFromMongoDB[]>;
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
