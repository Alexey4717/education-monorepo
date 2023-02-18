import {ObjectId} from 'mongodb';


export type AccountDataType = {
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

export type EmailConfirmationType = {
    /**
     * Code for confirm email
     */
    confirmationCode: string

    /**
     * Expiration date of confirmation link.
     */
    expirationDate: Date

    /**
     * Is confirmed email registered user.
     */
    isConfirmed: boolean
}

export type UserType = {
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
}

export type CreateUserInsertToDBModel = UserType & {
    /**
     * Inserted to mongodb id of user.
     */
    _id: ObjectId
}
