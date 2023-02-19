import {ObjectId} from "mongodb";


export type UpdateUserConfirmationCodeInputType = {
    userId: ObjectId,
    newCode: string
};
