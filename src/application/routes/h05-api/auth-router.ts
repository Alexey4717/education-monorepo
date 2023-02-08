import {Request, Response, Router} from "express";

import {usersService} from "../../../domain/users-service";
import {HTTP_STATUSES, RequestWithBody} from "../../../types/common";
import {LoginInputModel} from "../../../models/AuthModels/LoginInputModel";
import {jwtService} from "../../jwt-service";
import {loginInputValidations} from "../../../validations/auth/loginInputValidations";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {getMappedMeViewModel} from "../../../helpers";


export const authRouter = Router({})

authRouter.post(
    '/login',
    loginInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<LoginInputModel>,
        res: Response
    ) => {
        const {
            loginOrEmail,
            password
        } = req.body || {};
        const user = await usersService.checkCredentials({loginOrEmail, password});
        if (!user) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401);
            return;
        }
        const accessToken = await jwtService.createJWT(user);
        res.status(HTTP_STATUSES.OK_200).json({accessToken});
    });

authRouter.get(
    '/me',
    authMiddleware,
    (
        req: Request,
        res: Response
    ) => {
        if (!req.context.user) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return
        }
        res.status(HTTP_STATUSES.OK_200).json(getMappedMeViewModel(req.context.user))
    }
);