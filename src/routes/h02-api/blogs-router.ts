import {Request, Response, Router} from "express";

import {
    Paginator,
    HTTP_STATUSES,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery, SortDirections
} from "../../types";
import {GetMappedBlogOutputModel} from "../../models/BlogModels/GetBlogOutputModel";
import {CreateBlogInputModel} from "../../models/BlogModels/CreateBlogInputModel";
import {UpdateBlogInputModel} from "../../models/BlogModels/UpdateBlogInputModel";
import {inputValidationsMiddleware} from "../../middlewares/input-validations-middleware";
import {createBlogInputValidations} from "../../validations/blog/createBlogInputValidations";
import {updateBlogInputValidations} from "../../validations/blog/updateBlogInputValidations";
import {authorizationGuardMiddleware} from "../../middlewares/authorization-guard-middleware";
import {paramIdValidationMiddleware} from "../../middlewares/paramId-validation-middleware";
import {blogsQueryRepository} from "../../repositories/Queries-repo/blogs-query-repository";
import {blogsService} from "../../domain/blogs-service";
import {getMappedBlogViewModel, getMappedPostViewModel} from "../../helpers";
import {GetBlogsInputModel, SortBlogsBy} from "../../models/BlogModels/GetBlogsInputModel";
import {CreatePostInBlogInputModel} from "../../models/BlogModels/CreatePostInBlogInputModel";
import {createPostInBlogInputValidations} from "../../validations/blog/createPostInBlogInputValidations";
import {GetMappedPostOutputModel} from "../../models/PostModels/GetPostOutputModel";
import {GetPostsInputModel, SortPostsBy} from "../../models/PostModels/GetPostsInputModel";


export const blogsRouter = Router({});

blogsRouter.get(
    '/',
    async (req: RequestWithQuery<GetBlogsInputModel>, res: Response<Paginator<GetMappedBlogOutputModel[]>>
    ) => {
        const resData = await blogsQueryRepository.getBlogs({
            searchNameTerm: req.query.searchNameTerm?.toString() || null, // by-default null
            sortBy: (req.query.sortBy?.toString() || 'createdAt') as SortBlogsBy, // by-default createdAt
            sortDirection: (req.query.sortDirection?.toString() || SortDirections.desc) as SortDirections, // by-default desc
            pageNumber: +(req.query.pageNumber || 1), // by-default 1,
            pageSize: +(req.query.pageSize || 10) // by-default 10
        });
        const {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        } = resData || {};
        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(getMappedBlogViewModel)
        });
    });
blogsRouter.get(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response<GetMappedBlogOutputModel>) => {
        const resData = await blogsQueryRepository.findBlogById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(getMappedBlogViewModel(resData));
    });
blogsRouter.get(
    '/:id([0-9a-f]{24})/posts',
    paramIdValidationMiddleware,
    async (
        req: RequestWithParamsAndQuery<{ id: string }, GetPostsInputModel>,
        res: Response<Paginator<GetMappedPostOutputModel[]>>
    ) => {
        const resData = await blogsQueryRepository.getPostsInBlog({
            blogId: req.params.id,
            sortBy: (req.query.sortBy?.toString() || 'createdAt') as SortPostsBy, // by-default createdAt
            sortDirection: (req.query.sortDirection?.toString() || SortDirections.desc) as SortDirections, // by-default desc
            pageNumber: +(req.query.pageNumber || 1), // by-default 1
            pageSize: +(req.query.pageSize || 10) // by-default 10
        });

        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        } = resData || {};
        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(getMappedPostViewModel)
        });
    });

blogsRouter.post(
    '/',
    authorizationGuardMiddleware,
    createBlogInputValidations,
    inputValidationsMiddleware,
    async (req: RequestWithBody<CreateBlogInputModel>, res: Response<GetMappedBlogOutputModel>
    ) => {
        const createdBlog = await blogsService.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(getMappedBlogViewModel(createdBlog));
    });
blogsRouter.post(
    '/:id([0-9a-f]{24})/posts',
    authorizationGuardMiddleware,
    paramIdValidationMiddleware,
    createPostInBlogInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithParamsAndBody<{ id: string }, CreatePostInBlogInputModel>,
        res: Response<GetMappedPostOutputModel>
    ) => {
        const createdPostInBlog = await blogsService.createPostInBlog({
            blogId: req.params.id,
            input: req.body
        });

        // Если по какой-то причине не найден блог
        if (!createdPostInBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).json(getMappedPostViewModel(createdPostInBlog));
    });

blogsRouter.put(
    '/:id([0-9a-f]{24})',
    authorizationGuardMiddleware,
    paramIdValidationMiddleware,
    updateBlogInputValidations,
    inputValidationsMiddleware,
    async (req: RequestWithParamsAndBody<GetMappedBlogOutputModel, UpdateBlogInputModel>, res: Response
    ) => {
        const isBlogUpdated = await blogsService.updateBlog({id: req.params.id, input: req.body});
        if (!isBlogUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    });

blogsRouter.delete(
    '/:id([0-9a-f]{24})',
    authorizationGuardMiddleware,
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: RequestWithParams<GetMappedBlogOutputModel>, res: Response<void>) => {
        const resData = await blogsService.deleteBlogById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });
