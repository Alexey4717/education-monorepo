import { Request, Response, NextFunction } from 'express';

import { jwtService } from '../application/jwt-service';
import { usersQueryRepository } from '../repositories/Queries-repo/users-query-repository';
import { constants } from 'http2';

/**
 * упрощённая версия cookieRefreshTokenMiddleware
 * @param req
 * @param res
 * @param next
 */
export const cookieAccessTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
        return;
    }

    try {
        const { userId } = await jwtService.getDeviceAndUserIdsByRefreshToken(refreshToken) || {};

        if (!userId) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
            return;
        }

        const user = await usersQueryRepository.findUserById(userId);
        if (!user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
            return;
        }

        req.context.user = user;
        next();
    } catch (error) {
        console.error(`Access token middleware error: ${error}`);
        res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
};
