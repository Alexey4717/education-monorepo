import { Router } from 'express';

import { loginInputValidations } from '../../../validations/auth/loginInputValidations';
import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { authMiddleware } from '../../../middlewares/auth-middleware';
import { registrationInputValidations } from '../../../validations/auth/registrationInputValidations';
import { registrationConfirmationInputValidations } from '../../../validations/auth/registrationConfirmationInputValidations';
import { registrationEmailResendingInputValidations } from '../../../validations/auth/registrationEmailResendingInputValidations';
import { authControllers } from '../../../controllers/auth-controllers';
import { cookieRefreshTokenMiddleware } from '../../../middlewares/cookie-refresh-token-middleware';
import { cookieAccessTokenMiddleware } from '../../../middlewares/cookie-access-token-middleware';
import { rateLimitMiddleware } from '../../../middlewares/rate-limit-middleware';
import { newPasswordInputValidations } from '../../../validations/auth/newPasswordInputValidations';
import { passwordRecoveryInputValidations } from '../../../validations/auth/passwordRecoveryInputValidations';

export const authRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация и авторизация пользователей
 * components:
 *   schemas:
 *     Me:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         login:
 *           type: string
 *           example: "user123"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *       required:
 *         - userId
 *         - login
 *         - email
 *
 *     SigninInput:
 *       type: object
 *       required:
 *         - loginOrEmail
 *         - password
 *       properties:
 *         loginOrEmail:
 *           type: string
 *           example: "user123"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 20
 *           example: "qwerty123"
 *
 *     SignupInput:
 *       type: object
 *       required:
 *         - login
 *         - email
 *         - password
 *       properties:
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
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 20
 *           example: "qwerty123"
 *
 *     RegistrationConfirmInput:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: "123456"
 *
 *     ResendRegistrationInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *
 *     RecoveryPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *
 *     NewPasswordInput:
 *       type: object
 *       required:
 *         - recoveryCode
 *         - newPassword
 *       properties:
 *         recoveryCode:
 *           type: string
 *           example: "123456"
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 20
 *           example: "newpassword123"
 *
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       required:
 *         - accessToken
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SigninInput"
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Tokens"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "refreshToken=abcde12345; HttpOnly; Secure; Path=/; SameSite=Strict"
 *       400:
 *         description: Невалидные входные данные
 *       401:
 *         description: Неверный логин или пароль
 *       429:
 *         description: Слишком много запросов
 */
authRouter.post(
    '/login',
    rateLimitMiddleware,
    loginInputValidations,
    inputValidationsMiddleware,
    authControllers.login,
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Обновление токенов
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Токены успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Tokens"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "refreshToken=newtoken12345; HttpOnly; Secure; Path=/; SameSite=Strict"
 *       401:
 *         description: Невалидный refresh token
 */
authRouter.post(
    '/refresh-token',
    cookieRefreshTokenMiddleware,
    authControllers.refreshToken,
);

/**
 * @swagger
 * /auth/access-token:
 *   post:
 *     summary: Получение нового access токена
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access токен успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Tokens"
 *       401:
 *         description: Невалидный refresh token
 */
authRouter.get(
    '/access-token',
    cookieAccessTokenMiddleware,
    authControllers.getAccessToken,
);

/**
 * @swagger
 * /auth/registration:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SignupInput"
 *     responses:
 *       204:
 *         description: Регистрация успешна, письмо с подтверждением отправлено
 *       400:
 *         description: Невалидные входные данные или пользователь уже существует
 *       429:
 *         description: Слишком много запросов
 */
authRouter.post(
    '/registration',
    rateLimitMiddleware,
    registrationInputValidations,
    inputValidationsMiddleware,
    authControllers.registration,
);

/**
 * @swagger
 * /auth/registration-confirmation:
 *   post:
 *     summary: Подтверждение регистрации
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegistrationConfirmInput"
 *     responses:
 *       204:
 *         description: Регистрация успешно подтверждена
 *       400:
 *         description: Неверный код подтверждения или email уже подтвержден
 *       429:
 *         description: Слишком много запросов
 */
authRouter.post(
    '/registration-confirmation',
    rateLimitMiddleware,
    registrationConfirmationInputValidations,
    inputValidationsMiddleware,
    authControllers.registrationConfirmation,
);

/**
 * @swagger
 * /auth/password-recovery:
 *   post:
 *     summary: Запрос на восстановление пароля
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RecoveryPasswordInput"
 *     responses:
 *       204:
 *         description: Письмо с инструкциями по восстановлению отправлено
 *       400:
 *         description: Невалидный email
 *       429:
 *         description: Слишком много запросов
 */
authRouter.post(
    '/password-recovery',
    rateLimitMiddleware,
    passwordRecoveryInputValidations,
    inputValidationsMiddleware,
    authControllers.recoveryPassword,
);

/**
 * @swagger
 * /auth/new-password:
 *   post:
 *     summary: Установка нового пароля
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewPasswordInput"
 *     responses:
 *       204:
 *         description: Пароль успешно изменен
 *       400:
 *         description: Неверный код восстановления или невалидный пароль
 *       429:
 *         description: Слишком много запросов
 */
authRouter.post(
    '/new-password',
    rateLimitMiddleware,
    newPasswordInputValidations,
    inputValidationsMiddleware,
    authControllers.newPassword,
);

/**
 * @swagger
 * /auth/registration-email-resending:
 *   post:
 *     summary: Повторная отправка письма подтверждения
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResendRegistrationInput"
 *     responses:
 *       204:
 *         description: Письмо с подтверждением отправлено повторно
 *       400:
 *         description: Невалидный email или email уже подтвержден
 *       429:
 *         description: Слишком много запросов
 */
authRouter.post(
    '/registration-email-resending',
    rateLimitMiddleware,
    registrationEmailResendingInputValidations,
    inputValidationsMiddleware,
    authControllers.registrationEmailResending,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Успешный выход
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "refreshToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0"
 *       401:
 *         description: Невалидный refresh token
 */
authRouter.post(
    '/logout',
    cookieRefreshTokenMiddleware,
    authControllers.logout,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Me"
 *       401:
 *         description: Пользователь не авторизован
 */
authRouter.get('/me', authMiddleware, authControllers.getMe);
