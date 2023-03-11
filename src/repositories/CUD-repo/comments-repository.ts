import {ObjectId} from "mongodb";

// import {commentsCollection} from "../../store/db";
import {GetCommentOutputModelFromMongoDB, LikeStatus} from "../../models/CommentsModels/GetCommentOutputModel";
import CommentModel from '../../models/CommentsModels/Comment-model';
import CommentLikeStatusModel from "../../models/CommentLikeStatusModels/CommentLikeStatus-model";


export const commentsRepository = {
    async createCommentInPost(
        newComment: GetCommentOutputModelFromMongoDB & { postId: string }
    ): Promise<boolean> {
        try {
            await CommentModel.create(newComment);
            return true;
            // const result = await commentsCollection.insertOne(newComment)
            // return Boolean(result.insertedId);
        } catch (error) {
            console.log('commentsRepository.createCommentInPost error is occurred: ', error);
            return false;
        }
    },

    async updateCommentById({id, content}: any): Promise<boolean> {
        try {
            const result = await CommentModel.updateOne(
                {"_id": new ObjectId(id)},
                {$set: {content}}
            )
            // const result = await commentsCollection.updateOne(
            //     {"_id": new ObjectId(id)},
            //     {$set: {content}}
            // )
            return result?.matchedCount === 1;
        } catch (error) {
            console.log('commentsRepository.updateCommentById error is occurred: ', error);
            return false;
        }
    },

    async updateCommentLikeStatusByCommentId({
                                                 commentId,
                                                 userId,
                                                 likeStatus
                                             }: { commentId: string, userId: string, likeStatus: LikeStatus }): Promise<boolean> {
        try {
            const foundCommentLikeStatus = await CommentLikeStatusModel.findOne({commentId, userId});

            if (!foundCommentLikeStatus) {
                const newCommentLikeStatus = await CommentLikeStatusModel.create({
                    commentId,
                    userId,
                    likeStatus,
                });

                const result = await CommentModel.updateOne(
                    {"_id": new ObjectId(commentId)},
                    {$push: {likeStatuses: newCommentLikeStatus}},
                )
                return result?.matchedCount === 1;
            }

            const result = await CommentModel.updateOne(
                {"_id": new ObjectId(commentId), "likeStatuses.userId": userId},
                {
                    $set: {
                        'likeStatuses.$.likeStatus': likeStatus,
                        'likeStatuses.$.createdAt': new Date().toISOString()
                    }
                }
            )

            return result?.matchedCount === 1;
        } catch (error) {
            console.log('commentsRepository.updateCommentLikeStatusByCommentId error is occurred: ', error);
            return false;
        }
    },

    async deleteCommentById(id: string): Promise<boolean> {
        try {
            const result = await CommentModel.deleteOne({_id: new ObjectId(id)});
            // const result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.log('commentsRepository.deleteCommentById error is occurred: ', error);
            return false;
        }
    },
};
