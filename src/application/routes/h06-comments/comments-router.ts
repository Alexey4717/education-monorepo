import {Response, Router} from "express";
import {constants} from 'http2';
import {
    CommentManageStatuses,
    RequestWithParams,
    RequestWithParamsAndBody,
} from "../../../types/common";
import {GetMappedUserOutputModel} from "../../../models/UserModels/GetUserOutputModel";
import {getMappedCommentViewModel, getMappedUserViewModel} from "../../../helpers";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {commentsQueryRepository} from "../../../repositories/Queries-repo/comments-query-repository";
import {GetCommentInputModel} from "../../../models/CommentsModels/GetCommentInputModel";
import {GetMappedCommentOutputModel} from "../../../models/CommentsModels/GetCommentOutputModel";
import {settings} from "../../../settings";
import {updateCommentInputValidations} from "../../../validations/comment/updateCommentInputValidations";
import {UpdateCommentInputModel} from "../../../models/CommentsModels/UpdateCommentInputModel";
import {commentsService} from "../../../domain/comments-service";


export const commentsRouter = Router({});

commentsRouter.get(
    `/:id(${settings.ID_PATTERN_BY_DB_TYPE})`,
    paramIdValidationMiddleware,
    async (
        req: RequestWithParams<{id: string}>,
        res: Response<GetMappedCommentOutputModel>
    ) => {
        const foundComment = await commentsQueryRepository.getCommentById(req.params.id);
        if (!foundComment) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
            return;
        }
        res.status(constants.HTTP_STATUS_OK).json(getMappedCommentViewModel(foundComment));
    });

commentsRouter.put(
    `/:commentId(${settings.ID_PATTERN_BY_DB_TYPE})`,
    authMiddleware,
    paramIdValidationMiddleware,
    updateCommentInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithParamsAndBody<GetCommentInputModel, UpdateCommentInputModel>,
        res: Response<GetMappedUserOutputModel>
    ) => {
        if (!req.context.user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const result = await commentsService.updateCommentById({
            userId: req.context.user._id.toString(),
            id: req.params.commentId,
            content: req.body.content
        });

        if (result === CommentManageStatuses.NOT_OWNER) {
            res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
            return;
        }

        if (result === CommentManageStatuses.NOT_FOUND) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });

commentsRouter.delete(
    `/:commentId(${settings.ID_PATTERN_BY_DB_TYPE})`,
    authMiddleware,
    paramIdValidationMiddleware,
    async (
        req: RequestWithParams<GetCommentInputModel>,
        res: Response
    ) => {
        if (!req.context.user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const result = await commentsService.deleteCommentById({
            commentId: req.params.commentId,
            userId: req.context.user._id.toString(),
        });

        if (result === CommentManageStatuses.NOT_OWNER) {
            res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
            return;
        }

        if (result === CommentManageStatuses.NOT_FOUND) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });

