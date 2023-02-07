import {Request, Response, NextFunction} from "express";

import {HTTP_STATUSES} from '../types/common';
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authData = req?.headers?.authorization;
        if (!authData) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return;
        }

        const splitedAuthData = authData.split(' ');
        const authType = splitedAuthData[0];
        const token = splitedAuthData[1];


        const userId = await jwtService.getUserIdByToken(token);

        if (authType !== 'Bearer' || !userId) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401);
            return;
        }

        const foundUser = await usersService.findUserById(userId)

        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401);
            return;
        }

        req.context.user = foundUser;
        next();
    } catch (error) {
        console.log(`Authorization middleware error is occurred: ${error}`);
    }
};
