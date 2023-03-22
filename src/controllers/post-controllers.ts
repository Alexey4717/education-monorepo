import {Response} from "express";
import {constants} from "http2";

import {
    Paginator,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    SortDirections
} from "../types/common";
import {GetPostsInputModel, SortPostsBy} from "../models/PostModels/GetPostsInputModel";
import {GetMappedPostOutputModel, GetPostOutputModel} from "../models/PostModels/GetPostOutputModel";
import {postsQueryRepository} from "../repositories/Queries-repo/posts-query-repository";
import {getMappedCommentViewModel, getMappedCommentViewModel2, getMappedPostViewModel} from "../helpers";
import {GetPostInputModel} from "../models/PostModels/GetPostInputModel";
import {commentsQueryRepository} from "../repositories/Queries-repo/comments-query-repository";
import {SortPostCommentsBy} from "../models/CommentsModels/GetPostCommentsInputModel";
import {CreatePostInputModel} from "../models/PostModels/CreatePostInputModel";
import {postsService} from "../domain/posts-service";
import {CreateCommentInputModel} from "../models/CommentsModels/CreateCommentInputModel";
import {commentsService} from "../domain/comments-service";
import {UpdatePostInputModel} from "../models/PostModels/UpdatePostInputModel";
import {ObjectId} from "mongodb";
import {LikeStatus} from "../models/CommentsModels/GetCommentOutputModel";


export const postControllers = {
    async getPosts(
        req: RequestWithQuery<GetPostsInputModel>,
        res: Response<Paginator<GetMappedPostOutputModel[]>>
    ) {
        const resData = await postsQueryRepository.getPosts({
            sortBy: (req.query.sortBy?.toString() || 'createdAt') as SortPostsBy, // by-default createdAt
            sortDirection: (req.query.sortDirection?.toString() || SortDirections.desc) as SortDirections, // by-default desc
            pageNumber: +(req.query.pageNumber || 1), // by-default 1
            pageSize: +(req.query.pageSize || 10) // by-default 10
        });
        const {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        } = resData || {};
        res.status(constants.HTTP_STATUS_OK).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(getMappedPostViewModel)
        });
    },

    async getPost(
        req: RequestWithParams<GetPostInputModel>,
        res: Response<GetPostOutputModel>
    ) {
        const resData = await postsQueryRepository.findPostById(req.params.id);
        if (!resData) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }
        res.status(constants.HTTP_STATUS_OK).json(getMappedPostViewModel(resData));
    },

    async getCommentsOfPost(
        req: RequestWithParams<{ postId: string }>,
        res: Response
    ) {
        const postId = req.params.postId;

        const resData = await commentsQueryRepository.getPostComments({
            sortBy: (req.query.sortBy?.toString() || 'createdAt') as SortPostCommentsBy, // by-default createdAt
            sortDirection: (req.query.sortDirection?.toString() || SortDirections.desc) as SortDirections, // by-default desc
            pageNumber: +(req.query.pageNumber || 1), // by-default 1
            pageSize: +(req.query.pageSize || 10), // by-default 10
            postId
        });

        if (!resData) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
            return;
        }

        const {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        } = resData || {};

        const currentUserId = req?.context?.user?._id ? new ObjectId(req.context.user._id).toString() : undefined;

        // const itemsWithCurrentUserID = items.map(item => ({...item,  currentUserId: req?.context?.user?._id?.toString()}));
        const itemsWithMyStatus = items.map((item) => {
            const foundReactionByUserId = item.reactions.find((reaction) => reaction.userId === currentUserId);
            const myStatus = foundReactionByUserId?.likeStatus ?? LikeStatus.None;
            return {...item, myStatus};
        });

        // reaction.userId === currentUserId

        res.status(constants.HTTP_STATUS_OK).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: itemsWithMyStatus.map(getMappedCommentViewModel)
        });
    },

    async createPost(
        req: RequestWithBody<CreatePostInputModel>,
        res: Response<GetPostOutputModel>
    ) {
        const createdPost = await postsService.createPost(req.body);

        // Если указан невалидный blogId
        if (!createdPost) {
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
            return;
        }
        res
            .status(constants.HTTP_STATUS_CREATED)
            .json(getMappedPostViewModel(createdPost));
    },

    async createCommentInPost(
        req: RequestWithParamsAndBody<{ postId: string }, CreateCommentInputModel>,
        res: Response
    ) {
        if (!req.context.user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const currentUserId = req.context.user._id.toString()
        const createdCommentInPost = await commentsService.createCommentInPost({
            postId: req.params.postId,
            content: req.body.content,
            userId: currentUserId,
            userLogin: req.context.user.accountData.login
        })

        // Если не найден пост
        if (!createdCommentInPost) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
            return;
        }

        res.status(201).json(createdCommentInPost)
        // res.status(constants.HTTP_STATUS_CREATED).json(getMappedCommentViewModel({
        //     ...createdCommentInPost,
        //     currentUserId
        // }));
    },

    async updatePost(
        req: RequestWithParamsAndBody<GetPostInputModel, UpdatePostInputModel>,
        res: Response
    ) {
        const isPostUpdated = await postsService.updatePost({id: req.params.id, input: req.body});
        if (!isPostUpdated) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    },

    async deletePost(
        req: RequestWithParams<GetPostInputModel>,
        res: Response
    ) {
        const resData = await postsService.deletePostById(req.params.id);
        if (!resData) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    },
};
