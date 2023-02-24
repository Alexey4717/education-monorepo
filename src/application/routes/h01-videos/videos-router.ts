import {Router} from "express";

import {createVideoInputValidations} from "../../../validations/video/createVideoInputValidations";
import {updateVideoInputValidations} from "../../../validations/video/updateVideoInputValidations";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {videoControllers} from "../../../controllers/video-controllers";


export const videosRouter = Router({});

videosRouter.get(
    '/',
    videoControllers.getVideos
);
videosRouter.get(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    videoControllers.getVideo
);

videosRouter.post(
    '/',
    createVideoInputValidations,
    inputValidationsMiddleware,
    videoControllers.createVideo
);

videosRouter.put(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    updateVideoInputValidations,
    inputValidationsMiddleware,
    videoControllers.updateVideo
);

videosRouter.delete(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    videoControllers.deleteVideo
);
