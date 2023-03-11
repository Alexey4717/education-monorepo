import {WithId} from 'mongodb';
import {LikeStatus} from "../CommentsModels/GetCommentOutputModel";

export type GetCommentLikeStatusOutputModel = WithId<{
    commentId: string
    userId: string
    likeStatus: LikeStatus
    createdAt: string
}>;
