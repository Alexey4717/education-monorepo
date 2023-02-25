import {Router} from "express";

import {createVideoInputValidations} from "../../../validations/video/createVideoInputValidations";
import {updateVideoInputValidations} from "../../../validations/video/updateVideoInputValidations";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {videoControllers} from "../../../controllers/video-controllers";
import {settings} from "../../../settings";


export const videosRouter = Router({});

videosRouter.get(
    '/',
    videoControllers.getVideos
);
videosRouter.get(
    `/:id(${settings.ID_PATTERN_BY_DB_TYPE})`,
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
    `/:id(${settings.ID_PATTERN_BY_DB_TYPE})`,
    paramIdValidationMiddleware,
    updateVideoInputValidations,
    inputValidationsMiddleware,
    videoControllers.updateVideo
);

videosRouter.delete(
    `/:id(${settings.ID_PATTERN_BY_DB_TYPE})`,
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    videoControllers.deleteVideo
);
