import bcrypt from 'bcrypt';
import {ObjectId} from 'mongodb';

import {CreateUserInputModel} from "../models/UserModels/CreateUserInputModel";
import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {usersRepository} from "../repositories/CUD-repo/users-repository";
import {CheckCredentialsInputArgs, GenerateHashInputArgs} from "../types";


export const usersService = {
    async createUser({login, email, password}: CreateUserInputModel): Promise<GetUserOutputModelFromMongoDB> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newUser = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newUser);
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id);
    },

    async checkCredentials({loginOrEmail, password}: CheckCredentialsInputArgs) {
        const foundUser = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!foundUser || !foundUser?.passwordHash) return false;
        return await bcrypt.compare(password, foundUser.passwordHash);
    },
};