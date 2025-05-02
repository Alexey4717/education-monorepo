import { Router } from 'express';

import { securityDeviceControllers } from '../../../controllers/security-device-controllers';
import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { cookieRefreshTokenMiddleware } from '../../../middlewares/cookie-refresh-token-middleware';

export const securityDevicesRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Security Devices
 *   description: Управление устройствами безопасности (сессии пользователя)
 * components:
 *   schemas:
 *     SecurityDevice:
 *       type: object
 *       properties:
 *         ip:
 *           type: string
 *           format: ipv4
 *           example: "192.168.1.1"
 *         title:
 *           type: string
 *           example: "Chrome 105 (Windows 10)"
 *         lastActiveDate:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T10:00:00Z"
 *         deviceId:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *       required:
 *         - ip
 *         - title
 *         - lastActiveDate
 *         - deviceId
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 */

/**
 * @swagger
 * /security/devices:
 *   get:
 *     summary: Получить список активных устройств (сессий)
 *     tags: [Security Devices]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список активных устройств
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/SecurityDevice"
 *       401:
 *         description: Невалидный refresh token
 */
securityDevicesRouter.get(
	'/',
	cookieRefreshTokenMiddleware,
	securityDeviceControllers.getSecurityDevices
);

/**
 * @swagger
 * /security/devices:
 *   delete:
 *     summary: Удалить все устройства кроме текущего
 *     tags: [Security Devices]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Все устройства кроме текущего успешно удалены
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "refreshToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0"
 *       401:
 *         description: Невалидный refresh token
 */
securityDevicesRouter.delete(
	'/',
	cookieRefreshTokenMiddleware,
	securityDeviceControllers.deleteAllSecurityDevicesOmitCurrent
);

/**
 * @swagger
 * /security/devices/{id}:
 *   delete:
 *     summary: Удалить конкретное устройство по ID
 *     tags: [Security Devices]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID устройства (сессии)
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       204:
 *         description: Устройство успешно удалено
 *       401:
 *         description: Невалидный refresh token
 *       403:
 *         description: Нет прав для удаления этого устройства
 *       404:
 *         description: Устройство не найдено
 */
securityDevicesRouter.delete(
	'/:id',
	paramIdValidationMiddleware,
	// не вставляю мидлвэр, т.к. нужно отобразить 404 если не найден девайс
	// cookieRefreshTokenMiddleware,
	securityDeviceControllers.deleteSecurityDeviceById
);
