import { Router } from 'express';

import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { authMiddleware } from '../../../middlewares/auth-middleware';
import { updateCommentInputValidations } from '../../../validations/comment/updateCommentInputValidations';
import { commentControllers } from '../../../controllers/comment-controllers';
import { updateCommentLikeStatusInputValidations } from '../../../validations/comment/updateCommenLikeStatusInputValidations';
import { setUserDataMiddleware } from '../../../middlewares/set-user-data-middleware';

export const commentsRouter = Router({});

commentsRouter.get(
    '/:id',
    paramIdValidationMiddleware,
    setUserDataMiddleware,
    commentControllers.getComment
);

commentsRouter.put(
    '/:commentId',
    authMiddleware,
    paramIdValidationMiddleware,
    updateCommentInputValidations,
    inputValidationsMiddleware,
    commentControllers.updateComment
);
commentsRouter.put(
    '/:commentId/like-status',
    authMiddleware,
    paramIdValidationMiddleware,
    updateCommentLikeStatusInputValidations,
    inputValidationsMiddleware,
    commentControllers.changeLikeStatus
);

commentsRouter.delete(
    '/:commentId',
    authMiddleware,
    paramIdValidationMiddleware,
    commentControllers.deleteComment
);
