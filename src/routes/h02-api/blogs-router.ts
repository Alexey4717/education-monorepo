import {Request, Response, Router} from "express";

import {GetBlogOutputModel} from "../../models/BlogModels/GetBlogOutputModel";
import {blogsRepository} from "../../repositories/blogs-repository";
import {HTTP_STATUSES, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../types";
import {GetBlogInputModel} from "../../models/BlogModels/GetBlogInputModel";
import {CreateBlogInputModel} from "../../models/BlogModels/CreateBlogInputModel";
import {UpdateBlogInputModel} from "../../models/BlogModels/UpdateBlogInputModel";
import {inputValidationsMiddleware} from "../../middlewares/input-validations-middleware";
import {createBlogInputValidations} from "../../validations/blog/createBlogInputValidations";
import {updateBlogInputValidations} from "../../validations/blog/updateBlogInputValidations";
import {getDeleteBlogInputValidations} from "../../validations/blog/getDeleteBlogInputValidations";
import {authorizationGuardMiddleware} from "../../middlewares/authorization-guard-middleware";


export const blogsRouter = Router({});

blogsRouter.get(
    '/',
    (req: Request, res: Response<GetBlogOutputModel[]>
    ) => {
        const resData = blogsRepository.getBlogs();
        res.json(resData);
    });
blogsRouter.get(
    '/:id',
    getDeleteBlogInputValidations,
    inputValidationsMiddleware,
    (req: RequestWithParams<GetBlogInputModel>, res: Response<GetBlogOutputModel>) => {
        const resData = blogsRepository.findBlogById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(resData);
    });

blogsRouter.post(
    '/',
    authorizationGuardMiddleware,
    createBlogInputValidations,
    inputValidationsMiddleware,
    (req: RequestWithBody<CreateBlogInputModel>, res: Response<GetBlogOutputModel>
    ) => {
        const createdBlog: GetBlogOutputModel = blogsRepository.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    })

blogsRouter.put(
    '/:id',
    authorizationGuardMiddleware,
    updateBlogInputValidations,
    inputValidationsMiddleware,
    (req: RequestWithParamsAndBody<GetBlogInputModel, UpdateBlogInputModel>, res: Response
    ) => {
        const isBlogUpdated = blogsRepository.updateBlog({id: req.params.id, input: req.body});
        if (!isBlogUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    });

blogsRouter.delete(
    '/:id',
    authorizationGuardMiddleware,
    getDeleteBlogInputValidations,
    inputValidationsMiddleware,
    (req: RequestWithParams<GetBlogInputModel>, res: Response<void>) => {
        const resData = blogsRepository.deleteBlogById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });
