import {Schema, model} from "mongoose";

import {LikeStatus} from "../CommentsModels/GetCommentOutputModel";
import {GetCommentLikeStatusOutputModel} from "./GetCommentLikeStatusOutputModel";


export const CommentLikeStatusSchema = new Schema<GetCommentLikeStatusOutputModel>({
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, enum: LikeStatus},
    createdAt: {type: String, default: new Date().toISOString()},
})

export default model('commentLikeStatus', CommentLikeStatusSchema);
