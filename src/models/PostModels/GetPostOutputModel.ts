import {ObjectId} from 'mongodb';


export type GetPostOutputModel = {
    /**
     * Title of post from db, required.
     */
    title:	string

    /**
     * Short description of post from db, required.
     */
    shortDescription:	string

    /**
     * Content of post from db, required.
     */
    content:	string

    /**
     * blogId of post from db, required.
     */
    blogId:	string

    /**
     * Blog name of post from db, required.
     */
    blogName:	string

    /**
     * Date of post creation in db.
     */
    createdAt: string
}

export type GetPostOutputModelFromMongoDB = GetPostOutputModel & {
    /**
     * Id of post from mongoDB.
     */
    _id: ObjectId
}

export type GetMappedPostOutputModel = GetPostOutputModel & {
    /**
     * Id of post from db, required.
     */
    id: string
}
