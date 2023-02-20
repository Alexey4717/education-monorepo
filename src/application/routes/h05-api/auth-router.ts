import {Request, Response, Router} from "express";
import {constants} from 'http2';

import {authService} from "../../../domain/auth-service";
import {RequestWithBody, TokenTypes} from "../../../types/common";
import {SigninInputModel} from "../../../models/AuthModels/SigninInputModel";
import {jwtService} from "../../jwt-service";
import {loginInputValidations} from "../../../validations/auth/loginInputValidations";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {getMappedMeViewModel} from "../../../helpers";
import {SignupInputModel} from "../../../models/AuthModels/SignupInputModel";
import {RegistrationConfirmInputModel} from "../../../models/AuthModels/RegistrationConfirmInputModel";
import {ResendRegistrationInputModel} from "../../../models/AuthModels/ResendRegistrationInputModel";
import {registrationInputValidations} from "../../../validations/auth/registrationInputValidations";
import {
    registrationConfirmationInputValidations
} from "../../../validations/auth/registrationConfirmationInputValidations";
import {
    registrationEmailResendingInputValidations
} from "../../../validations/auth/registrationEmailResendingInputValidations";
import {RefreshTokenInputModel} from "../../../models/AuthModels/RefreshTokenInputModel";
import {usersQueryRepository} from "../../../repositories/Queries-repo/users-query-repository";
import {GetUserOutputModelFromMongoDB} from "../../../models/UserModels/GetUserOutputModel";


export const authRouter = Router({})

authRouter.post(
    '/login',
    loginInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<SigninInputModel>,
        res: Response
    ) => {
        const {
            loginOrEmail,
            password
        } = req.body || {};
        const user = await authService.checkCredentials({loginOrEmail, password});
        // можно было бы сделать проверку user.accountData.isConfirmed, если false не пускать
        if (!user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
            return;
        }
        const {accessToken, refreshToken} = await jwtService.createJWT(user);
        res
            .status(constants.HTTP_STATUS_OK)
            .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
            .json({accessToken});
    });
authRouter.post(
    '/refresh-token',
    async (
        req: RequestWithBody<RefreshTokenInputModel>,
        res: Response
    ) => {
        // If the JWT refreshToken inside cookie is missing, expired or incorrect return 401
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }
        const userId = await jwtService.getUserIdByToken({token: refreshToken, type: TokenTypes.refresh});
        const isFoundToken = await jwtService.findToken(refreshToken);
        if (!userId || !isFoundToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }
        const {
            accessToken,
            refreshToken: newRefreshToken
        } = await jwtService.createJWT({_id: userId} as GetUserOutputModelFromMongoDB);

        res
            .status(constants.HTTP_STATUS_OK)
            // rewrite after set new cookie??
            // .clearCookie("refreshToken")
            .cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
            .json({accessToken});
    });
authRouter.post(
    '/registration',
    registrationInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<SignupInputModel>,
        res: Response
    ) => {
        const {
            login,
            password,
            email
        } = req.body || {};

        const result = await authService.createUserAndSendConfirmationMessage({email, login, password});

        if (!result) {
            // maybe need send other status code
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });
authRouter.post(
    '/registration-confirmation',
    registrationConfirmationInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<RegistrationConfirmInputModel>,
        res: Response
    ) => {
        const {code} = req.body || {};
        const result = await authService.confirmEmail(code);
        if (!result) {
            // maybe need send other status code
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });
authRouter.post(
    '/registration-email-resending',
    registrationEmailResendingInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<ResendRegistrationInputModel>,
        res: Response
    ) => {
        const {email} = req.body || {};
        const result = await authService.resendConfirmationMessage(email);

        if (!result) {
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });
authRouter.post(
    '/logout',
    async (
        req: Request,
        res: Response
    ) => {
        // If the JWT refreshToken inside cookie is missing, expired or incorrect return 401
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }
        const userId = await jwtService.getUserIdByToken({token: refreshToken, type: TokenTypes.refresh});
        const isFoundToken = await jwtService.findToken(refreshToken);
        if (!userId || !isFoundToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }
        await jwtService.removeToken(userId);
        return res
            .clearCookie("refreshToken")
            .sendStatus(constants.HTTP_STATUS_NO_CONTENT);
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
