import {Router} from "express";

import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {adminBasicAuthMiddleware} from "../../../middlewares/admin-basicAuth-middleware";
import {createPostInputValidations} from "../../../validations/post/createPostInputValidations";
import {updatePostInputValidations} from "../../../validations/post/updatePostInputValidations";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {settings} from "../../../settings";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {createCommentInputValidations} from "../../../validations/comment/createCommentInputValidations";
import {postControllers} from "../../../controllers/post-controllers";


export const postsRouter = Router({});

postsRouter.get(
    '/',
    postControllers.getPosts
);
postsRouter.get(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    postControllers.getPost
);
postsRouter.get(
    `/:postId(${settings.ID_PATTERN_BY_DB_TYPE})/comments`,
    postControllers.getCommentsOfPost
);

postsRouter.post(
    '/',
    adminBasicAuthMiddleware,
    createPostInputValidations,
    inputValidationsMiddleware,
    postControllers.createPost
);
postsRouter.post(
    `/:postId(${settings.ID_PATTERN_BY_DB_TYPE})/comments`,
    authMiddleware,
    paramIdValidationMiddleware,
    createCommentInputValidations,
    inputValidationsMiddleware,
    postControllers.createCommentInPost
);

postsRouter.put(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    updatePostInputValidations,
    inputValidationsMiddleware,
    postControllers.updatePost
);

postsRouter.delete(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    postControllers.deletePost
);
