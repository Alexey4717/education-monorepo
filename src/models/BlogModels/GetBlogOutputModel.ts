export type GetBlogOutputModel = {
    /**
     * Id of blog from db, required.
     */
    id: string

    /**
     * Name of blog from db, required.
     */
    name:	string

    /**
     * Description of blog from db, required.
     */
    description:	string

    /**
     * WebsiteUrl to blog from db, required.
     */
    websiteUrl:	string
}
