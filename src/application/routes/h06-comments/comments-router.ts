import {Response, Router} from "express";
import {
    CommentManageStatuses,
    HTTP_STATUSES,
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
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(getMappedCommentViewModel(foundComment));
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
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return
        }

        const result = await commentsService.updateCommentById({
            userId: req.context.user._id.toString(),
            id: req.params.commentId,
            content: req.body.content
        });

        if (result === CommentManageStatuses.NOT_OWNER) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        if (result === CommentManageStatuses.NOT_FOUND) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
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
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return
        }

        const result = await commentsService.deleteCommentById({
            commentId: req.params.commentId,
            userId: req.context.user._id.toString(),
        });

        if (result === CommentManageStatuses.NOT_OWNER) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        if (result === CommentManageStatuses.NOT_FOUND) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

