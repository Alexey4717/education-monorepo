import jwt, {JwtPayload} from 'jsonwebtoken';
import {ObjectId} from 'mongodb';

import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(user: GetUserOutputModelFromMongoDB): Promise<string> {
        return jwt.sign(
            {userId: user._id},
            settings.JWT_SECRET,
            {expiresIn: '1h'}
        );
    },

    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const decoded = jwt.verify(token, settings.JWT_SECRET);
            return new ObjectId((decoded as JwtPayload).userId);
        } catch {
            return null;
        }

    }
};