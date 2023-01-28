import {ObjectId} from "mongodb";

import {UpdatePostInputModel} from "../../models/PostModels/UpdatePostInputModel";
import {postsCollection} from "../../store/db";
import {GetPostOutputModel} from "../../models/PostModels/GetPostOutputModel";


interface UpdatePostArgs {
    id: string
    input: UpdatePostInputModel
}

export const postsRepository = {
    async createPost(newPost: GetPostOutputModel): Promise<boolean> {
        try {
            const result = await postsCollection.insertOne(newPost);
            return Boolean(result.insertedId);
        } catch (error) {
            console.log(`postsRepository.createPost error is occurred: ${error}`);
            return false;
        }
    },

    async updatePost({id, input}: UpdatePostArgs): Promise<boolean> {
        try {
            const response = await postsCollection.updateOne(
                {"_id": new ObjectId(id)},
                {$set: input}
            );
            return response.matchedCount === 1;
        } catch (error) {
            console.log(`postsRepository.updatePost error is occurred: ${error}`);
            return false;
        }
    },

    async deletePostById(id: string): Promise<boolean> {
        try {
            const result = await postsCollection.deleteOne({"_id": new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(`postsRepository.deletePostById error is occurred: ${error}`);
            return false;
        }
    }
};
