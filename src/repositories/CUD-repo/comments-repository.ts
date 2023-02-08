import {ObjectId} from "mongodb";

import {commentsCollection} from "../../store/db";
import {GetCommentOutputModelFromMongoDB} from "../../models/CommentsModels/GetCommentOutputModel";


export const commentsRepository = {
    async createCommentInPost(
        newComment: GetCommentOutputModelFromMongoDB & {postId: string}
    ): Promise<boolean> {
        try {
            const result = await commentsCollection.insertOne(newComment)
            return Boolean(result.insertedId);
        } catch (error) {
            console.log('commentsRepository.createCommentInPost error is occurred: ', error);
            return false;
        }
    },

    async updateCommentById({id, content}: any): Promise<boolean> {
        try {
            const result = await commentsCollection.updateOne(
                {"_id": new ObjectId(id)},
                {$set: {content}}
            )
            return result?.matchedCount === 1;
        } catch (error) {
            console.log('commentsRepository.updateCommentById error is occurred: ', error);
            return false;
        }
    },

    async deleteCommentById(id: string): Promise<boolean> {
        try {
            const result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.log('commentsRepository.deleteCommentById error is occurred: ', error);
            return false;
        }
    }
};
