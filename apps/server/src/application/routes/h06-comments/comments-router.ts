import { Router } from 'express';

import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { authMiddleware } from '../../../middlewares/auth-middleware';
import { updateCommentInputValidations } from '../../../validations/comment/updateCommentInputValidations';
import { commentControllers } from '../../../controllers/comment-controllers';
import { updateCommentLikeStatusInputValidations } from '../../../validations/comment/updateCommenLikeStatusInputValidations';
import { setUserDataMiddleware } from '../../../middlewares/set-user-data-middleware';

export const commentsRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Управление комментариями
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         content:
 *           type: string
 *           minLength: 20
 *           maxLength: 300
 *           example: "Это комментарий к посту"
 *         commentatorInfo:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: "5f8d04b3ab35b3b3a8d3e3b1"
 *             userLogin:
 *               type: string
 *               example: "user123"
 *           required:
 *             - userId
 *             - userLogin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T10:00:00Z"
 *         likesInfo:
 *           type: object
 *           properties:
 *             likesCount:
 *               type: integer
 *               example: 5
 *             dislikesCount:
 *               type: integer
 *               example: 1
 *             myStatus:
 *               type: string
 *               enum: [None, Like, Dislike]
 *               example: "Like"
 *           required:
 *             - likesCount
 *             - dislikesCount
 *             - myStatus
 *       required:
 *         - id
 *         - content
 *         - commentatorInfo
 *         - createdAt
 *         - likesInfo
 *
 *     UpdateCommentInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 20
 *           maxLength: 300
 *           example: "Обновленный комментарий"
 *
 *     LikeStatusInput:
 *       type: object
 *       required:
 *         - likeStatus
 *       properties:
 *         likeStatus:
 *           type: string
 *           enum: [None, Like, Dislike]
 *           example: "Like"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Получить комментарий по ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID комментария
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       200:
 *         description: Комментарий найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 *       404:
 *         description: Комментарий не найден
 */
commentsRouter.get(
	'/:id',
	paramIdValidationMiddleware,
	setUserDataMiddleware,
	commentControllers.getComment
);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Обновить комментарий
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID комментария
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateCommentInput"
 *     responses:
 *       204:
 *         description: Комментарий успешно обновлен
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 *       403:
 *         description: Нет прав для изменения комментария
 *       404:
 *         description: Комментарий не найден
 */
commentsRouter.put(
	'/:commentId',
	authMiddleware,
	paramIdValidationMiddleware,
	updateCommentInputValidations,
	inputValidationsMiddleware,
	commentControllers.updateComment
);

/**
 * @swagger
 * /comments/{commentId}/like-status:
 *   put:
 *     summary: Обновить статус лайка комментария
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID комментария
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LikeStatusInput"
 *     responses:
 *       204:
 *         description: Статус лайка успешно обновлен
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Комментарий не найден
 */
commentsRouter.put(
	'/:commentId/like-status',
	authMiddleware,
	paramIdValidationMiddleware,
	updateCommentLikeStatusInputValidations,
	inputValidationsMiddleware,
	commentControllers.changeLikeStatus
);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Удалить комментарий
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID комментария
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       204:
 *         description: Комментарий успешно удален
 *       401:
 *         description: Требуется авторизация
 *       403:
 *         description: Нет прав для удаления комментария
 *       404:
 *         description: Комментарий не найден
 */
commentsRouter.delete(
	'/:commentId',
	authMiddleware,
	paramIdValidationMiddleware,
	commentControllers.deleteComment
);
