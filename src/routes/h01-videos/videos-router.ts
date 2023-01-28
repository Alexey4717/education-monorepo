import {Request, Response, Router} from "express";

import {GetVideoOutputModel, GetMappedVideoOutputModel} from "../../models/VideoModels/GetVideoOutputModel";
import {GetVideoInputModel} from "../../models/VideoModels/GetVideoInputModel";
import {HTTP_STATUSES, RequestWithBody, RequestWithParamsAndBody, RequestWithParams} from "../../types";
import {CreateVideoInputModel} from "../../models/VideoModels/CreateVideoInputModel";
import {GetErrorOutputModel} from "../../models/GetErrorOutputModel";
import {UpdateVideoInputModel} from "../../models/VideoModels/UpdateVideoInputModel";
import {createVideoInputValidations} from "../../validations/video/createVideoInputValidations";
import {updateVideoInputValidations} from "../../validations/video/updateVideoInputValidations";
import {inputValidationsMiddleware} from "../../middlewares/input-validations-middleware";
import {videosService} from "../../domain/videos-service";
import {videosQueryRepository} from "../../repositories/Queries-repo/videos-query-repository";
import {getMappedVideoViewModel} from "../../helpers";
import {paramIdValidationMiddleware} from "../../middlewares/paramId-validation-middleware";


export const videosRouter = Router({});

videosRouter.get(
    '/',
    async (req: Request, res: Response<GetVideoOutputModel[]>) => {
        const resData = await videosQueryRepository.getVideos();
        const videos = (resData || []).map(getMappedVideoViewModel);
        res.json(videos);
    })
videosRouter.get(
    '/:id',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (
        req: RequestWithParams<GetVideoInputModel>,
        res: Response<GetVideoOutputModel>
    ) => {
        const videoId = req.params?.id;
        if (!videoId) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const foundVideo = await videosQueryRepository.findVideoById(videoId);

        if (!foundVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        const mappedVideo = getMappedVideoViewModel(foundVideo);
        res.json(mappedVideo);
    })

videosRouter.post(
    '/',
    createVideoInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<CreateVideoInputModel>,
        res: Response<GetMappedVideoOutputModel | GetErrorOutputModel>
    ) => {
        const createdVideo = await videosService.createVideo(req.body)
        res.status(HTTP_STATUSES.CREATED_201).json(getMappedVideoViewModel(createdVideo));
    })

videosRouter.put(
    '/:id',
    paramIdValidationMiddleware,
    updateVideoInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithParamsAndBody<GetVideoInputModel, UpdateVideoInputModel>,
        res: Response<undefined | GetErrorOutputModel>
    ) => {
        const videoId = req.params?.id;

        // isBoolean() validator not working
        if (req.body.canBeDownloaded !== undefined && typeof req.body.canBeDownloaded !== 'boolean') {
            const errorsMessages = {
                errorsMessages: [{
                    message: 'CanBeDownloaded field must be boolean type',
                    field: 'canBeDownloaded'
                }]
            };
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errorsMessages)
            return;
        }

        // .isInt({min: 1, max: 18}) or .isNumeric().isLength({min: 1, max: 18}) not working
        if (req.body.minAgeRestriction !== undefined && (typeof req.body.minAgeRestriction !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1)) {
            const errorsMessages = {
                errorsMessages: [{
                    message: 'CanBeDownloaded field must be boolean type',
                    field: 'canBeDownloaded'
                }]
            };
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errorsMessages)
            return;
        }

        const isVideoUpdated = await videosService.updateVideo({id: videoId, input: req.body})

        if (!isVideoUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

videosRouter.delete(
    '/:id',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: Request<GetVideoInputModel>, res: Response<void>) => {
        const videoId = req.params?.id;
        const isDeletedVideo = await videosService.deleteVideoById(videoId);

        if (!isDeletedVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })
