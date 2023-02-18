import * as dotenv from "dotenv";
dotenv.config();

import type {SendEmailConfirmationMessageInputType} from "./types";
import {emailService} from "../domain/email-service";


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

    async sendPasswordRecoveryMessage(user: any) {
        const subject = 'Password recovery';
        const message = `
            <p>To recovery your password please follow the link below:
                <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>recovery password</a>
            </p>
        `;

        await emailService.sendPasswordRecoveryMessage({
            email: user.email,
            subject,
            message
        });
    },
};
