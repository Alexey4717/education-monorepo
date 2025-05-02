import { Router } from 'express';

import { createVideoInputValidations } from '../../../validations/video/createVideoInputValidations';
import { updateVideoInputValidations } from '../../../validations/video/updateVideoInputValidations';
import { inputValidationsMiddleware } from '../../../middlewares/input-validations-middleware';
import { paramIdValidationMiddleware } from '../../../middlewares/paramId-validation-middleware';
import { videoControllers } from '../../../composition-root';

export const videosRouter = Router({});

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: CRUD операции по разделу видео
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "5f8d04b3ab35b3b3a8d3e3b1"
 *         title:
 *           type: string
 *           example: "Как собрать ПК"
 *         author:
 *           type: string
 *           example: "Иван Иванов"
 *         canBeDownloaded:
 *           type: boolean
 *           default: false
 *         minAgeRestriction:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 18
 *           example: 16
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T10:00:00Z"
 *         availableResolutions:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]
 *           nullable: true
 *           example: ["P720", "P1080"]
 *       required:
 *         - id
 *         - title
 *         - author
 */

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Получить список видео
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: Список видео
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Video"
 */
videosRouter.get('/', videoControllers.getVideos.bind(videoControllers));

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Получить видео по ID
 *     description: Возвращает одно видео по указанному идентификатору
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор видео
 *         example: "5f8d04b3ab35b3b3a8d3e3b1"
 *     responses:
 *       200:
 *         description: Видео найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Video"
 *       404:
 *         description: Видео не найдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video not found"
 */
videosRouter.get(
	'/:id',
	paramIdValidationMiddleware,
	inputValidationsMiddleware,
	videoControllers.getVideo.bind(videoControllers)
);

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Создать новое видео
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - availableResolutions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 15
 *                 example: "Новое видео"
 *               author:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "Автор видео"
 *               availableResolutions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
 *                 example: ["P720", "P1080"]
 *     responses:
 *       201:
 *         description: Видео успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Video"
 *       400:
 *         description: Невалидные входные данные
 */
videosRouter.post(
	'/',
	createVideoInputValidations,
	inputValidationsMiddleware,
	videoControllers.createVideo.bind(videoControllers)
);

/**
 * @swagger
 * /videos/{id}:
 *   put:
 *     summary: Обновить видео
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID видео для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - availableResolutions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 40
 *                 example: "Обновленное название"
 *               author:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 20
 *                 example: "Новый автор"
 *               availableResolutions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
 *                 example: ["P480", "P720"]
 *               canBeDownloaded:
 *                 type: boolean
 *                 example: true
 *               minAgeRestriction:
 *                 type: integer
 *                 nullable: true
 *                 minimum: 1
 *                 maximum: 18
 *                 example: 16
 *     responses:
 *       204:
 *         description: Видео успешно обновлено
 *       400:
 *         description: Невалидные входные данные
 *       404:
 *         description: Видео не найдено
 */
videosRouter.put(
	'/:id',
	paramIdValidationMiddleware,
	updateVideoInputValidations,
	inputValidationsMiddleware,
	videoControllers.updateVideo.bind(videoControllers)
);

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     summary: Удалить видео
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID видео для удаления
 *     responses:
 *       204:
 *         description: Видео успешно удалено
 *       404:
 *         description: Видео не найдено
 */
videosRouter.delete(
	'/:id',
	paramIdValidationMiddleware,
	inputValidationsMiddleware,
	videoControllers.deleteVideo.bind(videoControllers)
);
