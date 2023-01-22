import {db} from "../store/mockedDB";
import {getPostViewModel} from "../helpers";
import {GetPostOutputModel} from "../models/PostModels/GetPostOutputModel";
import {CreatePostInputModel} from "../models/PostModels/CreatePostInputModel";
import {UpdatePostInputModel} from "../models/PostModels/UpdatePostInputModel";
import {blogsRepository} from "./blogs-repository";
import {postsCollection} from "../store/db";

interface UpdatePostArgs {
    id: string
    input: UpdatePostInputModel
}

export const postsRepository = {
    async getPosts(): Promise<GetPostOutputModel[]> {
        const result = await postsCollection.find({}).toArray();
        return result?.map(getPostViewModel);
    },

    async findPostById(id: string): Promise<GetPostOutputModel | null> {
        const foundPost = await postsCollection.findOne({id});
        return foundPost ? getPostViewModel(foundPost) : null;
    },

    async createPost(input: CreatePostInputModel): Promise<GetPostOutputModel | null> {
        const {
            title,
            shortDescription,
            blogId,
            content
        } = input || {};

        // Узнать может тут можно по-другому?
        const foundBlog = await blogsRepository.findBlogById(blogId);

        if (!foundBlog) return null;

        const newPost: GetPostOutputModel = {
            id: new Date().valueOf().toString(),
            title,
            shortDescription,
            blogId,
            blogName: foundBlog.name,
            content
        };

        await postsCollection.insertOne(newPost);
        return getPostViewModel(newPost);
    },

    async updatePost({id, input}: UpdatePostArgs): Promise<boolean> {
        const response = await postsCollection.updateOne(
            {id},
            {$set: input}
        );
        return response.matchedCount === 1;
    },

    async deletePostById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id});
        return result.deletedCount === 1;
    }
};
