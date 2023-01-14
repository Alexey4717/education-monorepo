import {db} from "../store/mockedDB";
import {getBlogViewModel} from "../helpers";
import {CreateBlogInputModel} from "../models/BlogModels/CreateBlogInputModel";
import {GetBlogOutputModel} from "../models/BlogModels/GetBlogOutputModel";
import {UpdateBlogInputModel} from "../models/BlogModels/UpdateBlogInputModel";

interface UpdateBlogArgs {
    id: string
    input: UpdateBlogInputModel
}

export const blogsRepository = {
    getBlogs() {
        return db.blogs.map(getBlogViewModel);
    },

    findBlogById(id: string) {
        const foundBlog = db.blogs.find((blog) => blog.id === id);
        return foundBlog ? getBlogViewModel(foundBlog) : null;
    },

    createBlog(input: CreateBlogInputModel) {
        const {
            name,
            websiteUrl,
            description
        } = input || {};

        const newBlog: GetBlogOutputModel = {
            id: new Date().valueOf().toString(),
            name,
            websiteUrl,
            description
        };

        db.blogs.push(newBlog);
        return newBlog;
    },

    updateBlog({id, input}: UpdateBlogArgs) {
        const foundBlogIndex = db.blogs.findIndex((blog) => blog.id === id);
        const foundBlog = db.blogs.find((blog) => blog.id === id);

        if (foundBlogIndex === -1 || !foundBlog) return false;

        db.blogs[foundBlogIndex] = {
            ...foundBlog,
            ...input
        };
        return true;
    },

    deleteBlogById(id: string) {
        const foundBlogIndex = db.blogs.findIndex((blog) => blog.id === id);
        if (foundBlogIndex === -1) return false;
        db.blogs.splice(foundBlogIndex, 1);
        return true;
    }
};
