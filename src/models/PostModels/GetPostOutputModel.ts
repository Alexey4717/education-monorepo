export type GetPostOutputModel = {
    /**
     * Id of post from db, required.
     */
    id: string

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
