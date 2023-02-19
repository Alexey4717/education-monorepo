import * as bcrypt from 'bcrypt';
import {ObjectId} from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns';

import type {CreateUserInputType} from "./types";
import {CreateUserInputModel} from "../models/UserModels/CreateUserInputModel";
import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {usersRepository} from "../repositories/CUD-repo/users-repository";
import {CheckCredentialsInputArgs} from "../types/common";
import {emailManager} from "../managers/email-manager";
import {CreateUserInsertToDBModel} from "../models/UserModels/CreateUserInsertToDBModel";


export const authService = {
    async createUser({login, email, password}: CreateUserInputModel): Promise<GetUserOutputModelFromMongoDB> {
        const newUser = await this._getNewUser({login, email, password, isConfirmed: true});
        return await usersRepository.createUser(newUser);
    },

    async createUserAndSendConfirmationMessage({login, email, password}: CreateUserInputModel): Promise<boolean> {
        const newUser = await this._getNewUser({login, email, password, isConfirmed: false});
        const createdUser = await usersRepository.createUser(newUser);
        try {
            await emailManager.sendEmailConfirmationMessage({
                email,
                confirmationCode: createdUser.emailConfirmation.confirmationCode
            });
        } catch (error) {
            console.error(`authService.registerUser error is occurred: ${error}`);
            await usersRepository.deleteUserById(createdUser._id.toString());
            return false;
        }
        return Boolean(createdUser);
    },

    async resendConfirmationMessage(email: string): Promise<boolean> {
        const foundUser = await usersRepository.findByLoginOrEmail(email);
        if (!foundUser) return false;
        return await emailManager.sendPasswordRecoveryMessage(foundUser);
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersRepository.findByConfirmationCode(code);
        if (
            !user ||
            user.emailConfirmation.isConfirmed ||
            user.emailConfirmation.confirmationCode !== code ||
            user.emailConfirmation.expirationDate <= new Date()
        ) return false;
        return await usersRepository.updateConfirmation(user._id);
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id);
    },

    async checkCredentials({
                               loginOrEmail,
                               password
                           }: CheckCredentialsInputArgs): Promise<GetUserOutputModelFromMongoDB | null> {
        const foundUser = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!foundUser || !foundUser?.accountData?.passwordHash) return null;
        const passwordIsValid = await bcrypt.compare(password, foundUser.accountData.passwordHash);
        if (!passwordIsValid) return null;
        return foundUser;
    },

    async _generateHash(password: string) {
        const passwordSalt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, passwordSalt);
    },

    async _getNewUser({login, email, password, isConfirmed}: CreateUserInputType): Promise<CreateUserInsertToDBModel> {
        const passwordHash = await this._generateHash(password);
        return {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(), // generate unique id
                expirationDate: add(new Date(), {hours: 1}),
                isConfirmed,
            },
        }
    },
};