import {model, Schema} from "mongoose";
import {GetCommentOutputModelFromMongoDB, LikeStatus} from "./GetCommentOutputModel";
import {CommentLikeStatusSchema} from "../CommentLikeStatusModels/CommentLikeStatus-model";


const now = new Date();

const CommentSchema = new Schema<GetCommentOutputModelFromMongoDB>({
    postId: {type: String, required: true},
    content: {type: String, required: true, min: 20, max: 300},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: String, default: new Date().toISOString()},
    likeStatuses: {
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
        likeStatuses: {type: [CommentLikeStatusSchema], default: []}
    }
});

export default model("Comment", CommentSchema);
