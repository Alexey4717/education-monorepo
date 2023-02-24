import {Router} from "express";

import {loginInputValidations} from "../../../validations/auth/loginInputValidations";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {registrationInputValidations} from "../../../validations/auth/registrationInputValidations";
import {
    registrationConfirmationInputValidations
} from "../../../validations/auth/registrationConfirmationInputValidations";
import {
    registrationEmailResendingInputValidations
} from "../../../validations/auth/registrationEmailResendingInputValidations";
import {authControllers} from "../../../controllers/auth-controllers";


export const authRouter = Router({});

authRouter.post(
    '/login',
    loginInputValidations,
    inputValidationsMiddleware,
    authControllers.login
);
authRouter.post(
    '/refresh-token',
    authControllers.refreshToken
);
authRouter.post(
    '/registration',
    registrationInputValidations,
    inputValidationsMiddleware,
    authControllers.registration
);
authRouter.post(
    '/registration-confirmation',
    registrationConfirmationInputValidations,
    inputValidationsMiddleware,
    authControllers.registrationConfirmation
);
authRouter.post(
    '/registration-email-resending',
    registrationEmailResendingInputValidations,
    inputValidationsMiddleware,
    authControllers.registrationEmailResending
);
authRouter.post(
    '/logout',
    authControllers.logout
);

authRouter.get(
    '/me',
    authMiddleware,
    authControllers.getMe
);
