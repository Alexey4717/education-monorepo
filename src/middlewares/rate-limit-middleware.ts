import {Request, Response, NextFunction} from 'express';
import {constants} from "http2";


type ConnectionType = {
    ip: string
    url: string
    method: string
    connectionDate: number
}

let connections: ConnectionType[] = []

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const now = +new Date();

    // тесты в ДЗ не проходят

    // let newConnections = [];

    // for (let i = 0; i < connections.length; i++) {
    //     if (((+new Date() - connections[i].connectionDate) / 1000) <= 10) {
    //         newConnections.push(connections[i]);
    //     }
    // }

    // connections = newConnections

    const blockInterval = 10 * 1000;
    const ip = req.ip;
    const url = req.originalUrl;
    const method = req.method;

    connections.push({
        ip,
        url,
        method,
        connectionDate: now
    });

    const connectionSessions = connections
        .filter(c => (
            c.ip === ip &&
            c.url === url &&
            c.method === method &&
            ((now - c.connectionDate) <= blockInterval)
        ));

    const connectionErrors = connectionSessions
        .filter(c => ((+new Date() - c.connectionDate) < blockInterval));

    console.log({url})
    console.log({connections})
    console.log({connectionSessions})

    const connectionsCount = connectionSessions.length

    if (connectionsCount > 5) {
        res.sendStatus(constants.HTTP_STATUS_TOO_MANY_REQUESTS);
        return;
    }

    next();
}

// Попробовать через cron запускать каждые 10 секунд метод по очистке
// https://www.npmjs.com/package/node-cron
