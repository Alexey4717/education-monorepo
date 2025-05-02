import { Router } from 'express';

import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { createBlogInputValidations } from '../../../validations/blog/createBlogInputValidations';
import { updateBlogInputValidations } from '../../../validations/blog/updateBlogInputValidations';
import { adminBasicAuthMiddleware } from '../../../middlewares/admin-basicAuth-middleware';
import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { createPostInBlogInputValidations } from '../../../validations/blog/createPostInBlogInputValidations';
import { blogControllers } from '../../../controllers/blog-controllers';
import { setUserDataMiddleware } from '../../../middlewares/set-user-data-middleware';

export const blogsRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: CRUD операции для работы с блогами
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         name:
 *           type: string
 *           maxLength: 15
 *           example: "Название блога"
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: "Описание блога"
 *         websiteUrl:
 *           type: string
 *           maxLength: 100
 *           format: uri
 *           pattern: "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
 *           example: "https://example.com"
 *         isMembership:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T10:00:00Z"
 *       required:
 *         - id
 *         - name
 *         - description
 *         - websiteUrl
 *         - createdAt
 *
 *     PostInBlog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         title:
 *           type: string
 *           maxLength: 30
 *           example: "Заголовок поста"
 *         shortDescription:
 *           type: string
 *           maxLength: 100
 *           example: "Краткое описание"
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
 *       required:
 *         - id
 *         - title
 *         - shortDescription
 *         - content
 *         - blogId
 *         - blogName
 *         - createdAt
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Получить список блогов
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: searchNameTerm
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Поисковый термин для фильтрации по названию блога
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, description, websiteUrl, createdAt]
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
 *         description: Список блогов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Blog"
 */
blogsRouter.get('/', blogControllers.getBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Получить блог по ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID блога
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       200:
 *         description: Блог найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blog"
 *       404:
 *         description: Блог не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog not found"
 */
blogsRouter.get(
	'/:id',
	paramIdValidationMiddleware,
	inputValidationsMiddleware,
	blogControllers.getBlog
);

/**
 * @swagger
 * /blogs/{id}/posts:
 *   get:
 *     summary: Получить посты блога
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID блога
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, shortDescription, content, createdAt]
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
 *         description: Список постов блога
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/PostInBlog"
 *       404:
 *         description: Блог не найден
 */
blogsRouter.get(
	'/:id/posts',
	paramIdValidationMiddleware,
	setUserDataMiddleware,
	blogControllers.getPostsOfBlog
);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Создать новый блог
 *     tags: [Blogs]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - websiteUrl
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 15
 *                 example: "Новый блог"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Описание нового блога"
 *               websiteUrl:
 *                 type: string
 *                 maxLength: 100
 *                 format: uri
 *                 pattern: "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
 *                 example: "https://newblog.com"
 *     responses:
 *       201:
 *         description: Блог успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blog"
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 */
blogsRouter.post(
	'/',
	adminBasicAuthMiddleware,
	createBlogInputValidations,
	inputValidationsMiddleware,
	blogControllers.createBlog
);

/**
 * @swagger
 * /blogs/{id}/posts:
 *   post:
 *     summary: Создать пост в блоге
 *     tags: [Blogs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID блога
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
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 example: "Новый пост"
 *               shortDescription:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Краткое описание поста"
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Содержание нового поста"
 *     responses:
 *       201:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostInBlog"
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Блог не найден
 */
blogsRouter.post(
	'/:id/posts',
	adminBasicAuthMiddleware,
	paramIdValidationMiddleware,
	setUserDataMiddleware,
	createPostInBlogInputValidations,
	inputValidationsMiddleware,
	blogControllers.createPostInBlog
);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Обновить блог
 *     tags: [Blogs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID блога
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - websiteUrl
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 15
 *                 example: "Обновленное название"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Обновленное описание"
 *               websiteUrl:
 *                 type: string
 *                 maxLength: 100
 *                 format: uri
 *                 pattern: "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
 *                 example: "https://updated.com"
 *     responses:
 *       204:
 *         description: Блог успешно обновлен
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Блог не найден
 */
blogsRouter.put(
	'/:id',
	adminBasicAuthMiddleware,
	paramIdValidationMiddleware,
	updateBlogInputValidations,
	inputValidationsMiddleware,
	blogControllers.updateBlog
);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Удалить блог
 *     tags: [Blogs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID блога
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       204:
 *         description: Блог успешно удален
 *       401:
 *         description: Требуется авторизация
 *       404:
 *         description: Блог не найден
 */
blogsRouter.delete(
	'/:id',
	adminBasicAuthMiddleware,
	paramIdValidationMiddleware,
	inputValidationsMiddleware,
	blogControllers.deleteBlog
);
