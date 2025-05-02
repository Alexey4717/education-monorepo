import { Router } from 'express';

import { adminBasicAuthMiddleware } from '../../../middlewares/admin-basicAuth-middleware';
import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { createUserInputValidations } from '../../../validations/user/createVideoInputValidations';
import { userControllers } from '../../../controllers/user-controllers';

export const usersRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями (только для администраторов)
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         login:
 *           type: string
 *           minLength: 3
 *           maxLength: 10
 *           pattern: "^[a-zA-Z0-9_-]*$"
 *           example: "user123"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T10:00:00Z"
 *       required:
 *         - id
 *         - login
 *         - email
 *         - createdAt
 *
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - login
 *         - password
 *         - email
 *       properties:
 *         login:
 *           type: string
 *           minLength: 3
 *           maxLength: 10
 *           pattern: "^[a-zA-Z0-9_-]*$"
 *           example: "newuser"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 20
 *           format: password
 *           example: "qwerty123"
 *         email:
 *           type: string
 *           format: email
 *           example: "newuser@example.com"
 *
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [login, email, createdAt]
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
 *       - in: query
 *         name: searchLoginTerm
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Поисковый термин для логина
 *       - in: query
 *         name: searchEmailTerm
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Поисковый термин для email
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       401:
 *         description: Требуется авторизация администратора
 */
usersRouter.get('/', adminBasicAuthMiddleware, userControllers.getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserInput"
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Требуется авторизация администратора
 */
usersRouter.post(
	'/',
	adminBasicAuthMiddleware,
	createUserInputValidations,
	inputValidationsMiddleware,
	userControllers.createUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       204:
 *         description: Пользователь успешно удален
 *       401:
 *         description: Требуется авторизация администратора
 *       404:
 *         description: Пользователь не найден
 */
usersRouter.delete(
	'/:id',
	adminBasicAuthMiddleware,
	paramIdValidationMiddleware,
	userControllers.deleteUser
);
