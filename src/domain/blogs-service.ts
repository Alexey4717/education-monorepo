import {CreateBlogInputModel} from "../models/BlogModels/CreateBlogInputModel";
import {GetBlogOutputModelFromMongoDB} from "../models/BlogModels/GetBlogOutputModel";
import {UpdateBlogInputModel} from "../models/BlogModels/UpdateBlogInputModel";
import {blogsRepository} from "../repositories/CUD-repo/blogs-repository";

interface UpdateBlogArgs {
    id: string
    input: UpdateBlogInputModel
}

export const blogsService = {
    async createBlog(input: CreateBlogInputModel): Promise<GetBlogOutputModelFromMongoDB> {
        const {
            name,
            websiteUrl,
            description
        } = input || {};

        const newBlog = {
            name,
            websiteUrl,
            description,
            createdAt: new Date().toISOString()
        };

        await blogsRepository.createBlog(newBlog);
        return newBlog as GetBlogOutputModelFromMongoDB;
    },


    async updateBlog({id, input}: UpdateBlogArgs): Promise<boolean> {
        return await blogsRepository.updateBlog({id, input});
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id);
    }
};
