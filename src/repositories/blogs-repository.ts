import {db} from "../store/mockedDB";
import {blogsCollection} from '../store/db';
import {getBlogViewModel} from "../helpers";
import {CreateBlogInputModel} from "../models/BlogModels/CreateBlogInputModel";
import {GetBlogOutputModel} from "../models/BlogModels/GetBlogOutputModel";
import {UpdateBlogInputModel} from "../models/BlogModels/UpdateBlogInputModel";

interface UpdateBlogArgs {
    id: string
    input: UpdateBlogInputModel
}

export const blogsRepository = {
    async getBlogs(): Promise<GetBlogOutputModel[]> {
        const blogs = await blogsCollection.find({}).toArray();
        return (blogs || []).map(getBlogViewModel);
    },

    async findBlogById(id: string): Promise<GetBlogOutputModel | null> {
        const foundBlog = await blogsCollection.findOne({id});
        return foundBlog ? getBlogViewModel(foundBlog) : null;
    },

    async createBlog(input: CreateBlogInputModel): Promise<GetBlogOutputModel> {
        const {
            name,
            websiteUrl,
            description
        } = input || {};

        const newBlog = {
            id: new Date().valueOf().toString(),
            name,
            websiteUrl,
            description
        };

        await blogsCollection.insertOne(newBlog);
        return getBlogViewModel(newBlog);
    },

    async updateBlog({id, input}: UpdateBlogArgs): Promise<boolean> {
        const result = await blogsCollection.updateOne(
            {id},
            {
                $set: {
                    name: input.name,
                    description: input.description,
                    websiteUrl: input.websiteUrl
                }
            }
        )
        return result?.matchedCount === 1;
        // смотрим matchedCount, а не modifiedCount, т.к. при полном соответствии
        // данных mongo не производит операцию обновления и не вернет ничего
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id});
        return result.deletedCount === 1;
    }
};
