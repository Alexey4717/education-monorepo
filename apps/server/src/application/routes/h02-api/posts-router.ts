import { Router } from 'express';

import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { adminBasicAuthMiddleware } from '../../../middlewares/admin-basicAuth-middleware';
import { createPostInputValidations } from '../../../validations/post/createPostInputValidations';
import { updatePostInputValidations } from '../../../validations/post/updatePostInputValidations';
import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { authMiddleware } from '../../../middlewares/auth-middleware';
import { createCommentInputValidations } from '../../../validations/comment/createCommentInputValidations';
import { postControllers } from '../../../controllers/post-controllers';
import { setUserDataMiddleware } from '../../../middlewares/set-user-data-middleware';
import { updatePostLikeStatusInputValidations } from '../../../validations/post/updatePostLikeStatusInputValidations';

export const postsRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: CRUD операции для работы с постами
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         title:
 *           type: string
 *           maxLength: 30
 *           example: "Название поста"
 *         shortDescription:
 *           type: string
 *           maxLength: 100
 *           example: "Краткое описание поста"
 *         content:
 *           type: string
 *           maxLength: 1000
 *           example: "Содержание поста"
 *         blogId:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         blogName:
 *           type: string
 *           example: "Название блога"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T10:00:00Z"
 *         extendedLikesInfo:
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
 *             newestLikes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   addedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-05-20T10:00:00Z"
 *                   userId:
 *                     type: string
 *                     example: "5f8d04b3ab35b3b3a8d3e3b1"
 *                   login:
 *                     type: string
 *                     example: "user123"
 *       required:
 *         - id
 *         - title
 *         - shortDescription
 *         - content
 *         - blogId
 *         - blogName
 *         - createdAt
 *         - extendedLikesInfo
 *
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
 *       required:
 *         - id
 *         - content
 *         - commentatorInfo
 *         - createdAt
 *         - likesInfo
 *
 *     LikeStatusInput:
 *       type: object
 *       properties:
 *         likeStatus:
 *           type: string
 *           enum: [None, Like, Dislike]
 *           example: "Like"
 *       required:
 *         - likeStatus
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Получить список постов
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, shortDescription, content, blogId, blogName, createdAt]
 *           default: createdAt
 *         description: Поле для сортировки
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Направление сортировки
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Размер страницы
 *     responses:
 *       200:
 *         description: Список постов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Post"
 */
postsRouter.get('/', setUserDataMiddleware, postControllers.getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Получить пост по ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID поста
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       200:
 *         description: Пост найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
 */
postsRouter.get(
	'/:id',
	paramIdValidationMiddleware,
	setUserDataMiddleware,
	inputValidationsMiddleware,
	postControllers.getPost
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Получить комментарии поста
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID поста
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [content, createdAt]
 *           default: createdAt
 *         description: Поле для сортировки
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Направление сортировки
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Размер страницы
 *     responses:
 *       200:
 *         description: Список комментариев
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Comment"
 *       404:
 *         description: Пост не найден
 */
postsRouter.get(
	'/:postId/comments',
	setUserDataMiddleware,
	postControllers.getCommentsOfPost
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Создать новый пост
 *     tags: [Posts]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - content
 *               - blogId
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 example: "Новый пост"
 *               shortDescription:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Краткое описание"
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Содержание поста"
 *               blogId:
 *                 type: string
 *                 example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       201:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 */
postsRouter.post(
	'/',
	adminBasicAuthMiddleware,
	setUserDataMiddleware,
	createPostInputValidations,
	inputValidationsMiddleware,
	postControllers.createPost
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Создать комментарий к посту
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID поста
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 300
 *                 example: "Это комментарий к посту"
 *     responses:
 *       201:
 *         description: Комментарий успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Пост не найден
 */
postsRouter.post(
	'/:postId/comments',
	authMiddleware,
	paramIdValidationMiddleware,
	createCommentInputValidations,
	inputValidationsMiddleware,
	postControllers.createCommentInPost
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Обновить пост
 *     tags: [Posts]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID поста
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - content
 *               - blogId
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 example: "Обновленный пост"
 *               shortDescription:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Обновленное описание"
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Обновленное содержание"
 *               blogId:
 *                 type: string
 *                 example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       204:
 *         description: Пост успешно обновлен
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Пост не найден
 */
postsRouter.put(
	'/:id',
	adminBasicAuthMiddleware,
	paramIdValidationMiddleware,
	updatePostInputValidations,
	inputValidationsMiddleware,
	postControllers.updatePost
);

/**
 * @swagger
 * /posts/{postId}/like-status:
 *   put:
 *     summary: Обновить статус лайка поста
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID поста
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
 *         description: Пост не найден
 */
postsRouter.put(
	'/:postId/like-status',
	paramIdValidationMiddleware,
	authMiddleware,
	updatePostLikeStatusInputValidations,
	inputValidationsMiddleware,
	postControllers.updatePostLikeStatus
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Удалить пост
 *     tags: [Posts]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID поста
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       204:
 *         description: Пост успешно удален
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Пост не найден
 */
postsRouter.delete(
	'/:id',
	adminBasicAuthMiddleware,
	paramIdValidationMiddleware,
	postControllers.deletePost
);
