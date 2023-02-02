import {ObjectId} from "mongodb";

import {GetPostOutputModelFromMongoDB} from "../../models/PostModels/GetPostOutputModel";
import {postsCollection} from "../../store/db";
import {Paginator, GetPostsArgs, SortDirections} from "../../types";
import {calculateAndGetSkipValue} from "../../helpers";


export const postsQueryRepository = {
    async getPosts({
                       sortBy,
                       sortDirection,
                       pageNumber,
                       pageSize
                   }: GetPostsArgs): Promise<Paginator<GetPostOutputModelFromMongoDB[]>> {
        try {
            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            const filter = {};
            const items = await postsCollection
                .find(filter)
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
            const totalCount = await postsCollection.count(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                page: pageNumber,
                pageSize,
                totalCount,
                pagesCount,
                items
            };
        } catch (error) {
            console.log(`postsQueryRepository.getPosts error is occurred: ${error}`);
            return {} as Paginator<GetPostOutputModelFromMongoDB[]>;
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
