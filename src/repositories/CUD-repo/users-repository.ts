import {usersCollection} from "../../store/db";
import {ObjectId} from "mongodb";
import {GetUserOutputModelFromMongoDB} from "../../models/UserModels/GetUserOutputModel";
import {CreateUserInsertToDBModel} from "../../models/UserModels/CreateUserInsertToDBModel";


export const usersRepository = {
    async createUser(newUser: CreateUserInsertToDBModel): Promise<GetUserOutputModelFromMongoDB> {
        try {
            const {
                login,
                email,
                passwordHash,
                createdAt
            } = newUser
            const result = await usersCollection.insertOne(newUser);
            if (!result.insertedId) throw new Error('Insert user error');
            const createdUser = {
                _id: result.insertedId,
                login,
                email,
                createdAt,
                passwordHash
            };
            return createdUser
        } catch (error) {
            console.log(`usersRepository.createUser error is occurred: ${error}`)
            return {} as GetUserOutputModelFromMongoDB;
        }
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<GetUserOutputModelFromMongoDB | null> {
        return usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
    },

    async deleteUserById(id: string): Promise<boolean> {
        try {
            const result = await usersCollection.deleteOne({"_id": new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(`usersRepository.deleteUserById error is occurred: ${error}`)
            return false;
        }
    }
};