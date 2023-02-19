import * as dotenv from "dotenv";
dotenv.config();
import {v4 as uuidv4} from 'uuid';

import type {SendEmailConfirmationMessageInputType} from "./types";
import {emailService} from "../domain/email-service";
import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {usersRepository} from "../repositories/CUD-repo/users-repository";


export const emailManager = {
    async sendEmailConfirmationMessage({email, confirmationCode}: SendEmailConfirmationMessageInputType) {
        return await emailService.sendEmailConfirmationMessage({
            email,
            subject: 'Registration confirmation',
            // тут непонятно как формировать ссылку на сайт и как из бади доставать код если он в query params
            message: `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href="${process.env.MAIN_URL}/confirm-email?code=${confirmationCode}">
                        complete registration
                    </a>
                </p>
            `,
        });
    },

    async sendPasswordRecoveryMessage(user: GetUserOutputModelFromMongoDB): Promise<boolean> {
        const newCode = uuidv4();
        const result = await usersRepository.updateUserConfirmationCode({userId: user._id, newCode});
        if (!result) return false;
        return await emailService.sendPasswordRecoveryMessage({
            email: user.accountData.email,
            subject: 'Password recovery',
            message: `
                <p>To recovery your password please follow the link below:
                    <a href='${process.env.MAIN_URL}/confirm-registration?code=${newCode}'>
                        recovery password
                    </a>
                </p>
            `,
        });
    },
};
