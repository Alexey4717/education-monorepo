import {ObjectId} from 'mongodb';


export type GetUserOutputModel = {
    /**
     * User login, required.
     */
    login: string

    /**
     * User email, required.
     */
    email: string

    /**
     * Date of created user.
     */
    createdAt: string
}

export type GetUserOutputModelFromMongoDB = GetUserOutputModel & {
    /**
     * Inserted id user from mongodb
     */
    _id: ObjectId
}

export type GetMappedUserOutputModel = GetUserOutputModel & {
    /**
     * Mapped id of user from db
     */
    id: string
}
