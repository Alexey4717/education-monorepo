import jwt, {JwtPayload} from 'jsonwebtoken';
import {ObjectId} from 'mongodb';

import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {settings} from "../settings";
import {TokenTypes} from "../types/common";


type CreateJWTInputType = {
    accessToken: string
    refreshToken: string
};

type ManageTokenInputType = {
    token: string
    type: TokenTypes
};

export const jwtService = {
    async createJWT(user: GetUserOutputModelFromMongoDB): Promise<CreateJWTInputType> {
        const accessToken = jwt.sign(
            {userId: user._id},
            settings.JWT_SECRET,
            {expiresIn: settings.JWT_EXPIRATION}
        );

        const refreshToken = jwt.sign(
            {userId: user._id},
            settings.REFRESH_JWT_SECRET,
            {expiresIn: settings.JWT_REFRESH_EXPIRATION}
        );

        return {
            accessToken,
            refreshToken
        }
    },

    async getUserIdByToken({token, type}: ManageTokenInputType): Promise<ObjectId | null> {
        try {
            const secret = type === TokenTypes.access
                ? settings.JWT_SECRET
                : settings.REFRESH_JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            return new ObjectId((decoded as JwtPayload).userId);
        } catch {
            return null;
        }
    },
};