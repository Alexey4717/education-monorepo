import {WithId} from 'mongodb';
import {GetCommentLikeStatusOutputModel} from "../CommentLikeStatusModels/GetCommentLikeStatusOutputModel";


export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

type CommentatorInfoType = {
    userId: string,
    userLogin: string
};

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus
}

export type GetCommentOutputModel = {
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    likesInfo: LikesInfo
};

export type GetMappedCommentOutputModel = GetCommentOutputModel & {
    id: string
};

export type GetCommentOutputModelFromMongoDB = WithId<Omit<GetCommentOutputModel, 'likesInfo'>> & {
    postId?: string
    likeStatuses: GetCommentLikeStatusOutputModel[]
};
