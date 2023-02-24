import {Router} from "express";

import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {settings} from "../../../settings";
import {updateCommentInputValidations} from "../../../validations/comment/updateCommentInputValidations";
import {commentControllers} from "../../../controllers/comment-controllers";


export const commentsRouter = Router({});

commentsRouter.get(
    `/:id(${settings.ID_PATTERN_BY_DB_TYPE})`,
    paramIdValidationMiddleware,
    commentControllers.getComment
);

commentsRouter.put(
    `/:commentId(${settings.ID_PATTERN_BY_DB_TYPE})`,
    authMiddleware,
    paramIdValidationMiddleware,
    updateCommentInputValidations,
    inputValidationsMiddleware,
    commentControllers.updateComment
);

commentsRouter.delete(
    `/:commentId(${settings.ID_PATTERN_BY_DB_TYPE})`,
    authMiddleware,
    paramIdValidationMiddleware,
    commentControllers.deleteComment
);

