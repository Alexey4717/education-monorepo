import {Request, Response, NextFunction} from "express";

import {HTTP_STATUSES} from '../types/common';
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/Queries-repo/users-query-repository";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authData = req?.headers?.authorization;
        if (!authData) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return;
        }

        const splitAuthData = authData.split(' ');
        const authType = splitAuthData[0];
        const token = splitAuthData[1];

        const userId = await jwtService.getUserIdByToken(token);

        if (authType !== 'Bearer' || !userId) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401);
            return;
        }

        const foundUser = await usersQueryRepository.findUserById(userId)

        req.context.user = foundUser;
        next();
    } catch (error) {
        console.log(`Auth middleware error is occurred: ${error}`);
    }
};
