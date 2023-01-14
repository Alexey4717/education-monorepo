import {db} from "../store/mockedDB";
import {getPostViewModel} from "../helpers";
import {GetPostOutputModel} from "../models/PostModels/GetPostOutputModel";
import {CreatePostInputModel} from "../models/PostModels/CreatePostInputModel";
import {UpdatePostInputModel} from "../models/PostModels/UpdatePostInputModel";
import {blogsRepository} from "./blogs-repository";

interface UpdatePostArgs {
    id: string
    input: UpdatePostInputModel
}

export const postsRepository = {
    getPosts() {
        return db.posts.map(getPostViewModel);
    },

    findPostById(id: string) {
        const foundPost = db.posts.find((post) => post.id === id);
        return foundPost ? getPostViewModel(foundPost) : null;
    },

    createPost(input: CreatePostInputModel) {
        const {
            title,
            shortDescription,
            blogId,
            content
        } = input || {};

        const foundBlog = blogsRepository.findBlogById(blogId);

        if (!foundBlog) return null;

        const newPost: GetPostOutputModel = {
            id: new Date().valueOf().toString(),
            title,
            shortDescription,
            blogId,
            blogName: foundBlog.name,
            content
        };

        db.posts.push(newPost);
        return newPost;
    },

    updatePost({id, input}: UpdatePostArgs) {
        const foundPostIndex = db.posts.findIndex((post) => post.id === id);
        const foundPost = db.posts.find((post) => post.id === id);

        const foundBlog = blogsRepository.findBlogById(input.blogId);

        if (foundPostIndex === -1 || !foundPost || !foundBlog) return false;

        db.posts[foundPostIndex] = {
            ...foundPost,
            ...input
        };
        return true;
    },

    deletePostById(id: string) {
        const foundPostIndex = db.posts.findIndex((post) => post.id === id);
        if (foundPostIndex === -1) return false;
        db.posts.splice(foundPostIndex, 1);
        return true;
    }
};
