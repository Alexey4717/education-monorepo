import {ObjectId} from "mongodb";

import {GetPostOutputModelFromMongoDB} from "../../models/PostModels/GetPostOutputModel";
import {postsCollection} from "../../store/db";
import {GetPostsArgs, SortDirections} from "../../types";
import {calculateAndGetSkipValue} from "../../helpers";


export const postsQueryRepository = {
    async getPosts({
                       sortBy,
                       sortDirection,
                       pageNumber,
                       pageSize
                   }: GetPostsArgs): Promise<GetPostOutputModelFromMongoDB[]> {
        try {
            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            return await postsCollection
                .find({})
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
        } catch (error) {
            console.log(`postsQueryRepository.getPosts error is occurred: ${error}`);
            return [];
        }
    },

    async findPostById(id: string): Promise<GetPostOutputModelFromMongoDB | null> {
        try {
            const foundPost = await postsCollection.findOne({"_id": new ObjectId(id)});
            return foundPost ?? null;
        } catch (error) {
            console.log(`postsQueryRepository.findPostById error is occurred: ${error}`);
            return null;
        }
    },
};
