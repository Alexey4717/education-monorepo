import {Response, Router} from "express";
import {constants} from 'http2';

import {
    Paginator,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery, SortDirections
} from "../../../types/common";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {adminBasicAuthMiddleware} from "../../../middlewares/admin-basicAuth-middleware";
import {GetPostOutputModel, GetMappedPostOutputModel} from "../../../models/PostModels/GetPostOutputModel";
import {CreatePostInputModel} from "../../../models/PostModels/CreatePostInputModel";
import {GetPostInputModel} from "../../../models/PostModels/GetPostInputModel";
import {UpdatePostInputModel} from '../../../models/PostModels/UpdatePostInputModel';
import {createPostInputValidations} from "../../../validations/post/createPostInputValidations";
import {updatePostInputValidations} from "../../../validations/post/updatePostInputValidations";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {postsQueryRepository} from "../../../repositories/Queries-repo/posts-query-repository";
import {getMappedCommentViewModel, getMappedPostViewModel} from "../../../helpers";
import {postsService} from "../../../domain/posts-service";
import {GetPostsInputModel, SortPostsBy} from "../../../models/PostModels/GetPostsInputModel";
import {settings} from "../../../settings";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {CreateCommentInputModel} from "../../../models/CommentsModels/CreateCommentInputModel";
import {commentsService} from "../../../domain/comments-service";
import {createCommentInputValidations} from "../../../validations/comment/createCommentInputValidations";
import {commentsQueryRepository} from "../../../repositories/Queries-repo/comments-query-repository";
import {SortPostCommentsBy} from "../../../models/CommentsModels/GetPostCommentsInputModel";


export const postsRouter = Router({});

postsRouter.get(
    '/',
    async (req: RequestWithQuery<GetPostsInputModel>, res: Response<Paginator<GetMappedPostOutputModel[]>>
    ) => {
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
    });
postsRouter.get(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: RequestWithParams<GetPostInputModel>, res: Response<GetPostOutputModel>) => {
        const resData = await postsQueryRepository.findPostById(req.params.id);
        if (!resData) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }
        res.status(constants.HTTP_STATUS_OK).json(getMappedPostViewModel(resData));
    });
postsRouter.get(
    `/:postId(${settings.ID_PATTERN_BY_DB_TYPE})/comments`,
    async (
        req: RequestWithParams<{ postId: string }>,
        res: Response
    ) => {
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

        res.status(constants.HTTP_STATUS_OK).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(getMappedCommentViewModel)
        });
    });

postsRouter.post(
    '/',
    adminBasicAuthMiddleware,
    createPostInputValidations,
    inputValidationsMiddleware,
    async (req: RequestWithBody<CreatePostInputModel>, res: Response<GetPostOutputModel>
    ) => {
        const createdPost = await postsService.createPost(req.body);

        // Если указан невалидный blogId
        if (!createdPost) {
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
            return;
        }
        res.status(constants.HTTP_STATUS_CREATED).json(getMappedPostViewModel(createdPost));
    })
postsRouter.post(
    `/:postId(${settings.ID_PATTERN_BY_DB_TYPE})/comments`,
    authMiddleware,
    paramIdValidationMiddleware,
    createCommentInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithParamsAndBody<{ postId: string }, CreateCommentInputModel>,
        res: Response
    ) => {
        if (!req.context.user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const createdCommentInPost = await commentsService.createCommentInPost({
            postId: req.params.postId,
            content: req.body.content,
            userId: req.context.user._id.toString(),
            userLogin: req.context.user.accountData.login
        })

        // Если не найден пост
        if (!createdCommentInPost) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
            return;
        }
        res.status(constants.HTTP_STATUS_CREATED).json(getMappedCommentViewModel(createdCommentInPost));
    }
)

postsRouter.put(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    updatePostInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithParamsAndBody<GetPostInputModel, UpdatePostInputModel>,
        res: Response
    ) => {
        const isPostUpdated = await postsService.updatePost({id: req.params.id, input: req.body});
        if (!isPostUpdated) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    });

postsRouter.delete(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    async (
        req: RequestWithParams<GetPostInputModel>,
        res: Response
    ) => {
        const resData = await postsService.deletePostById(req.params.id);
        if (!resData) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });
