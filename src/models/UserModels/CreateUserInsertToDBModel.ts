import {ObjectId} from 'mongodb';


export type CreateUserInsertToDBModel = {
    /**
     * Inserted to mongodb id of user.
     */
    _id: ObjectId

    /**
     * Set user`s login. Required. MaxLength: 10, minLength: 3.
     */
    login: string

    /**
     * Set user`s email, required.
     */
    email: string

    /**
     * Generated hash from salt and user password.
     */
    passwordHash: string

    /**
     * Created date of user.
     */
    createdAt: string
}
