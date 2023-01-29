import {ObjectId} from "mongodb";

import {blogsCollection} from '../../store/db';
import {GetBlogOutputModelFromMongoDB} from "../../models/BlogModels/GetBlogOutputModel";
import {SortDirections, GetBlogsArgs} from "../../types";
import {calculateAndGetSkipValue} from "../../helpers";


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
