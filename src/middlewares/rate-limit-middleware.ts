import {Request, Response, NextFunction} from 'express';

import rateLimit from 'express-rate-limit';
// import MongoStore from 'rate-limit-mongo';
// const MongoStore = require('rate-limit-mongo');
import {constants} from "http2";


export const rateLimitMiddleware = (requestPropertyName: string) => rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message:
        'Too many queries sent from this IP, please try again after an 10 seconds',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode: constants.HTTP_STATUS_TOO_MANY_REQUESTS,
    requestPropertyName
});


// Тут падают 500 ошибки

// export const rateLimitMiddleware = rateLimit({
//     store: new MongoStore({
//         uri: 'mongodb+srv://express-app.4kywzwt.mongodb.net/It-incubator-01-dev?retryWrites=true&w=majority',
//         user: 'alexey47174717',
//         password: '47174717ab',
//         // should match windowMs
//         expireTimeMs: 10 * 1000,
//         errorHandler: console.error.bind(null, 'rate-limit-mongo')
//         // see Configuration section for more options and details
//     }),
//     max: 5,
//     // should match expireTimeMs
//     windowMs: 15 * 60 * 1000,
//     statusCode: constants.HTTP_STATUS_TOO_MANY_REQUESTS,
// });


// Попробовать сделать свой лимитер

// type ConnectionType = {
//     ip: string
//     url: string
//     method: string
//     connectionDate: number
// }
//
// const connections: ConnectionType[] = []
//
// export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const blockInterval = 10 * 1000;
//     const ip = req.ip;
//     const url = req.originalUrl;
//     const method = req.method;
//
//     const connectionDate = +new Date();
//
//     const connectionsSession = connections
//         .filter(c => c.ip === ip && c.url === url && c.method === method)
//         .sort((a: ConnectionType, b: ConnectionType) => {
//             if (a.connectionDate > b.connectionDate) return 1;
//             if (a.connectionDate < b.connectionDate) return -1;
//             return 0;
//         });
//
//     const differenceDateConnection = (
//         connectionsSession[connectionsSession.length - 1].connectionDate - connectionsSession[0].connectionDate
//     ) / 1000;
//
//     const connectionsCount = connectionsSession.length
//
//
//     if (connectionsCount >= 5 && differenceDateConnection >= 10) {
//         res.sendStatus(constants.HTTP_STATUS_TOO_MANY_REQUESTS);
//         return;
//     }
//
//     connections.push({
//         ip,
//         url,
//         method,
//         connectionDate
//     })
//
//     return next();
// }

// Попробовать через cron запускать каждые 10 секунд метод по очистке
// https://www.npmjs.com/package/node-cron
