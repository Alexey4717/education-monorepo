import {Request, Response, Router} from "express";
import {constants} from 'http2';

import {GetVideoOutputModel, GetMappedVideoOutputModel} from "../../../models/VideoModels/GetVideoOutputModel";
import {GetVideoInputModel} from "../../../models/VideoModels/GetVideoInputModel";
import {RequestWithBody, RequestWithParamsAndBody, RequestWithParams} from "../../../types/common";
import {CreateVideoInputModel} from "../../../models/VideoModels/CreateVideoInputModel";
import {GetErrorOutputModel} from "../../../models/GetErrorOutputModel";
import {UpdateVideoInputModel} from "../../../models/VideoModels/UpdateVideoInputModel";
import {createVideoInputValidations} from "../../../validations/video/createVideoInputValidations";
import {updateVideoInputValidations} from "../../../validations/video/updateVideoInputValidations";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {videosService} from "../../../domain/videos-service";
import {videosQueryRepository} from "../../../repositories/Queries-repo/videos-query-repository";
import {getMappedVideoViewModel} from "../../../helpers";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";


export const videosRouter = Router({});

videosRouter.get(
    '/',
    async (req: Request, res: Response<GetVideoOutputModel[]>) => {
        const resData = await videosQueryRepository.getVideos();
        const videos = (resData || []).map(getMappedVideoViewModel);
        res.json(videos);
    })
videosRouter.get(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (
        req: RequestWithParams<GetVideoInputModel>,
        res: Response<GetVideoOutputModel>
    ) => {
        const videoId = req.params?.id;
        if (!videoId) {
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            return;
        }

        const foundVideo = await videosQueryRepository.findVideoById(videoId);

        if (!foundVideo) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
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
        res.status(constants.HTTP_STATUS_CREATED).json(getMappedVideoViewModel(createdVideo));
    })

videosRouter.put(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    updateVideoInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithParamsAndBody<GetVideoInputModel, UpdateVideoInputModel>,
        res: Response<undefined | GetErrorOutputModel>
    ) => {
        const videoId = req.params?.id;
        const isVideoUpdated = await videosService.updateVideo({id: videoId, input: req.body})

        if (!isVideoUpdated) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    })

videosRouter.delete(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    async (req: Request<GetVideoInputModel>, res: Response<void>) => {
        const videoId = req.params?.id;
        const isDeletedVideo = await videosService.deleteVideoById(videoId);

        if (!isDeletedVideo) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    })
