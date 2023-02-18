import {CreateUserInputModel} from "../models/UserModels/CreateUserInputModel";

export type SendEmailConfirmationMessageInputType = {
    email: string
    subject: string
    message: string
};

export type CreateUserInputType = CreateUserInputModel & {
    isConfirmed: boolean
};
