import {ObjectId} from 'mongodb';


type CommentatorInfoType = {
    userId: string,
    userLogin: string
};

export type GetCommentOutputModel = {
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
};

export type GetMappedCommentOutputModel = GetCommentOutputModel & {
    id: string
};

export type GetCommentOutputModelFromMongoDB = GetCommentOutputModel & {
    _id: ObjectId
    postId?: string
};
