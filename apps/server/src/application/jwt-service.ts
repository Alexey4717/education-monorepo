import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { GetUserOutputModelFromMongoDB } from '../models/UserModels/GetUserOutputModel';
import { settings } from '../settings';
import { TokenTypes } from '../types/common';

type ManageTokenInputType = {
    token: string;
    type: TokenTypes;
};

type CreateRefreshJWTArg = {
    userId: ObjectId;
    deviceId: ObjectId;
};

export const jwtService = {
    async createAccessJWT(
        user: GetUserOutputModelFromMongoDB
    ): Promise<string> {
        const payload = { userId: user._id.toString() };
        const options: SignOptions = {
            expiresIn: settings.JWT_EXPIRATION,
        };
        return jwt.sign(payload, settings.JWT_SECRET, options);
    },

    async createRefreshJWT(payload: CreateRefreshJWTArg) {
        const tokenPayload = {
            userId: payload.userId.toString(),
            deviceId: payload.deviceId.toString(),
        };
        const options: SignOptions = {
            expiresIn: settings.JWT_REFRESH_EXPIRATION,
        };
        return jwt.sign(tokenPayload, settings.REFRESH_JWT_SECRET, options);
    },

    async getUserIdByToken({
        token,
        type,
    }: ManageTokenInputType): Promise<ObjectId | null> {
        try {
            const secret =
                type === TokenTypes.access
                    ? settings.JWT_SECRET
                    : settings.REFRESH_JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            return (decoded as JwtPayload).userId;
        } catch {
            return null;
        }
    },

    async getDeviceAndUserIdsByRefreshToken(
        refreshToken: string
    ): Promise<{ deviceId: ObjectId; userId: ObjectId } | null> {
        try {
            const { deviceId, userId } = jwt.verify(
                refreshToken,
                settings.REFRESH_JWT_SECRET
            ) as JwtPayload;
            return {
                deviceId: new ObjectId(deviceId),
                userId: new ObjectId(userId),
            };
        } catch {
            return null;
        }
    },
};
