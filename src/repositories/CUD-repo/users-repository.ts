import {usersCollection} from "../../store/db";
import {ObjectId} from "mongodb";
import {CreateUserInputModel} from "../../models/UserModels/CreateUserInputModel";
import {GetUserOutputModelFromMongoDB} from "../../models/UserModels/GetUserOutputModel";


export const usersRepository = {
    async createUser(newUser: CreateUserInputModel & { createdAt: string }): Promise<GetUserOutputModelFromMongoDB> {
        try {
            const {
                login,
                email,
                createdAt
            } = newUser
            const result = await usersCollection.insertOne(newUser);
            if (!result.insertedId) throw new Error('Insert user error');
            const createdUser = {
                _id: result.insertedId,
                login,
                email,
                createdAt
            };
            return createdUser
        } catch (error) {
            console.log(`usersRepository.createUser error is occurred: ${error}`)
            return {} as GetUserOutputModelFromMongoDB;
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        try {
            const result = await usersCollection.deleteOne({"_id" : new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(`usersRepository.deleteUserById error is occurred: ${error}`)
            return false;
        }
    }
};