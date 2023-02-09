import {Request, Response, Router} from "express";
import {constants} from 'http2';

import {usersService} from "../../../domain/users-service";
import {RequestWithBody} from "../../../types/common";
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
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
            return;
        }
        const accessToken = await jwtService.createJWT(user);
        res.status(constants.HTTP_STATUS_OK).json({accessToken});
    });

authRouter.get(
    '/me',
    authMiddleware,
    (
        req: Request,
        res: Response
    ) => {
        if (!req.context.user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }
        res.status(constants.HTTP_STATUS_OK).json(getMappedMeViewModel(req.context.user))
    }
);