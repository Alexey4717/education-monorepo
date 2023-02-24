import {Request, Response} from "express";
import {constants} from "http2";

import {RequestWithBody, TokenTypes} from "../types/common";
import {SigninInputModel} from "../models/AuthModels/SigninInputModel";
import {authService} from "../domain/auth-service";
import {jwtService} from "../application/jwt-service";
import {RefreshTokenInputModel} from "../models/AuthModels/RefreshTokenInputModel";
import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {SignupInputModel} from "../models/AuthModels/SignupInputModel";
import {RegistrationConfirmInputModel} from "../models/AuthModels/RegistrationConfirmInputModel";
import {ResendRegistrationInputModel} from "../models/AuthModels/ResendRegistrationInputModel";
import {getMappedMeViewModel} from "../helpers";


export const authControllers = {
    async login(
        req: RequestWithBody<SigninInputModel>,
        res: Response
    ) {
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
    },

    async refreshToken(
        req: RequestWithBody<RefreshTokenInputModel>,
        res: Response
    ) {
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
    },

    async registration(
        req: RequestWithBody<SignupInputModel>,
        res: Response
    ) {
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
    },

    async registrationConfirmation(
        req: RequestWithBody<RegistrationConfirmInputModel>,
        res: Response
    ) {
        const {code} = req.body || {};
        const result = await authService.confirmEmail(code);
        if (!result) {
            // maybe need send other status code
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    },

    async registrationEmailResending(
        req: RequestWithBody<ResendRegistrationInputModel>,
        res: Response
    ) {
        const {email} = req.body || {};
        const result = await authService.resendConfirmationMessage(email);

        if (!result) {
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    },

    async logout(
        req: Request,
        res: Response
    ) {
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
    },

    async getMe(
        req: Request,
        res: Response
    ) {
        if (!req.context.user) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }
        res.status(constants.HTTP_STATUS_OK).json(getMappedMeViewModel(req.context.user))
    },
};
