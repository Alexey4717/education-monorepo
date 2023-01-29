import {Request, Response, Router} from "express";

import {GetBlogOutputModel} from "../../models/BlogModels/GetBlogOutputModel";
import {
    HTTP_STATUSES,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
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
import {getMappedBlogViewModel} from "../../helpers";
import {GetBlogsInputModel, SortBlogsBy} from "../../models/BlogModels/GetBlogsInputModel";


export const blogsRouter = Router({});

blogsRouter.get(
    '/',
    async (req: RequestWithQuery<GetBlogsInputModel>, res: Response<GetMappedBlogOutputModel[]>
    ) => {
        const resData = await blogsQueryRepository.getBlogs({
            searchNameTerm: req.query.searchNameTerm?.toString() || null, // by-default null
            sortBy: (req.query.sortBy?.toString() || 'createdAt') as SortBlogsBy, // by-default createdAt
            sortDirection: (req.query.sortDirection?.toString() || SortDirections.desc) as SortDirections, // by-default desc
            pageNumber: +(req.query.pageNumber || 1), // by-default 1
            pageSize: +(req.query.pageSize || 10) // by-default 10
        });
        res.status(HTTP_STATUSES.OK_200).json(resData.map(getMappedBlogViewModel));
    });
blogsRouter.get(
    '/:id',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: RequestWithParams<GetMappedBlogOutputModel>, res: Response<GetBlogOutputModel>) => {
        const resData = await blogsQueryRepository.findBlogById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(getMappedBlogViewModel(resData));
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
    })

blogsRouter.put(
    '/:id',
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
    '/:id',
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
