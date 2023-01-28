import {Request, Response, Router} from "express";

import {HTTP_STATUSES, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../types";
import {inputValidationsMiddleware} from "../../middlewares/input-validations-middleware";
import {authorizationGuardMiddleware} from "../../middlewares/authorization-guard-middleware";
import {GetPostOutputModel} from "../../models/PostModels/GetPostOutputModel";
import {CreatePostInputModel} from "../../models/PostModels/CreatePostInputModel";
import {GetPostInputModel} from "../../models/PostModels/GetPostInputModel";
import {UpdatePostInputModel} from '../../models/PostModels/UpdatePostInputModel';
import {createPostInputValidations} from "../../validations/post/createPostInputValidations";
import {updatePostInputValidations} from "../../validations/post/updatePostInputValidations";
import {paramIdValidationMiddleware} from "../../middlewares/paramId-validation-middleware";
import {postsQueryRepository} from "../../repositories/Queries-repo/posts-query-repository";
import {getMappedBlogViewModel, getMappedPostViewModel} from "../../helpers";
import {postsService} from "../../domain/posts-service";


export const postsRouter = Router({});

postsRouter.get(
    '/',
    async (req: Request, res: Response<GetPostOutputModel[]>
    ) => {
        const resData = await postsQueryRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(resData.map(getMappedPostViewModel));
    });
postsRouter.get(
    '/:id',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: RequestWithParams<GetPostInputModel>, res: Response<GetPostOutputModel>) => {
        const resData = await postsQueryRepository.findPostById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(getMappedPostViewModel(resData));
    });

postsRouter.post(
    '/',
    authorizationGuardMiddleware,
    createPostInputValidations,
    inputValidationsMiddleware,
    async (req: RequestWithBody<CreatePostInputModel>, res: Response<GetPostOutputModel>
    ) => {
        const createdPost = await postsService.createPost(req.body);

        // Если указан невалидный blogId
        if (!createdPost) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).json(getMappedPostViewModel(createdPost));
    })

postsRouter.put(
    '/:id',
    authorizationGuardMiddleware,
    paramIdValidationMiddleware,
    updatePostInputValidations,
    inputValidationsMiddleware,
    async (req: RequestWithParamsAndBody<GetPostInputModel, UpdatePostInputModel>, res: Response
    ) => {
        const isPostUpdated = await postsService.updatePost({id: req.params.id, input: req.body});
        if (!isPostUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    });

postsRouter.delete(
    '/:id',
    authorizationGuardMiddleware,
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: RequestWithParams<GetPostInputModel>, res: Response<void>) => {
        const resData = await postsService.deletePostById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });
