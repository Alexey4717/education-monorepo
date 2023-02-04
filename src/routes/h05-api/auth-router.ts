import {Response, Router} from "express";

import {usersService} from "../../domain/users-service";
import {HTTP_STATUSES, RequestWithBody} from "../../types";
import {LoginInputModel} from "../../models/AuthModels/LoginInputModel";


export const authRouter = Router({})

authRouter.post(
    '/login',
    async (
        req: RequestWithBody<LoginInputModel>,
        res: Response
    ) => {
        const {
            loginOrEmail,
            password
        } = req.body || {};
        const checkResult = await usersService.checkCredentials({loginOrEmail, password});
        if (!checkResult) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401);
            return;
        }
        // тут изменить потом
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });