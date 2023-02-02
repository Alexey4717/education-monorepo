import {CreateUserInputModel} from "../models/UserModels/CreateUserInputModel";
import {GetUserOutputModelFromMongoDB} from "../models/UserModels/GetUserOutputModel";
import {usersRepository} from "../repositories/CUD-repo/users-repository";

export const usersService = {
    async createUser(input: CreateUserInputModel): Promise<GetUserOutputModelFromMongoDB> {
        // сделать хэш пароля
        const newUser = {
            ...input,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newUser);
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id);
    }
};