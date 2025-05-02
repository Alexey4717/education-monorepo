import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const baseDir = path.join(__dirname, '..'); // Поднимаемся на уровень выше (из dist/swagger.js в dist/)

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express API with Swagger',
			version: '1.0.0',
			description: 'API документация для Express.js сервера',
		},
		servers: [
			{
				url: 'http://localhost:3001',
			},
		],
		models: {
			VideoModels: {},
		},
	},
	apis: [path.join(baseDir, 'src/application/routes/**/*.ts')],
};

export const specs = swaggerJsdoc(options);
