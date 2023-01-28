import {GetPostOutputModelFromMongoDB} from "../models/PostModels/GetPostOutputModel";
import {CreatePostInputModel} from "../models/PostModels/CreatePostInputModel";
import {UpdatePostInputModel} from "../models/PostModels/UpdatePostInputModel";
import {blogsQueryRepository} from "../repositories/Queries-repo/blogs-query-repository";
import {postsRepository} from "../repositories/CUD-repo/posts-repository";


interface UpdatePostArgs {
    id: string
    input: UpdatePostInputModel
}

export const postsService = {
    async createPost(input: CreatePostInputModel): Promise<GetPostOutputModelFromMongoDB | null> {
        const {
            title,
            shortDescription,
            blogId,
            content
        } = input || {};

        const foundBlog = await blogsQueryRepository.findBlogById(blogId);

        if (!foundBlog) return null;

        const newPost = {
            title,
            shortDescription,
            blogId,
            blogName: foundBlog.name,
            content,
            createdAt: new Date().toISOString()
        };

        await postsRepository.createPost(newPost);
        return newPost as GetPostOutputModelFromMongoDB;
    },

    async updatePost({id, input}: UpdatePostArgs): Promise<boolean> {
        return await postsRepository.updatePost({id, input});
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id);
    }
};
