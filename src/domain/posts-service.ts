import {
    GetMappedPostOutputModel,
    GetPostOutputModelFromMongoDB,
    TPostDb
} from "../models/PostModels/GetPostOutputModel";
import {CreatePostInputModel} from "../models/PostModels/CreatePostInputModel";
import {UpdatePostInputModel} from "../models/PostModels/UpdatePostInputModel";
import {blogsQueryRepository} from "../repositories/Queries-repo/blogs-query-repository";
import {postsRepository} from "../repositories/CUD-repo/posts-repository";
import {ObjectId} from "mongodb";
import {LikeStatus} from "../types/common";


interface UpdatePostArgs {
    id: string
    input: UpdatePostInputModel
}

interface UpdateLikeStatusPostArgs {
    postId: string
    userId: string
    userLogin: string
    likeStatus: LikeStatus
}

export const postsService = {
    _mapPostToViewType(post: TPostDb): GetMappedPostOutputModel {
        const currentDateString = new Date().toISOString();
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: currentDateString,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
    },

    async createPost(input: CreatePostInputModel): Promise<GetMappedPostOutputModel | null> {
        const {
            title,
            shortDescription,
            blogId,
            content
        } = input || {};

        const foundBlog = await blogsQueryRepository.findBlogById(blogId);

        if (!foundBlog) return null;

        const newPost: TPostDb = {
            _id: new ObjectId(),
            title,
            shortDescription,
            blogId,
            blogName: foundBlog.name,
            content,
            createdAt: new Date().toISOString(),
            reactions: [],
        };

        await postsRepository.createPost(newPost);
        return this._mapPostToViewType(newPost);
    },

    async updatePost({id, input}: UpdatePostArgs): Promise<boolean> {
        return await postsRepository.updatePost({id, input});
    },

    async updatePostLikeStatus({postId, userId, userLogin, likeStatus}: UpdateLikeStatusPostArgs): Promise<boolean> {
        return await postsRepository.updatePostLikeStatus({
            postId,
            userId,
            userLogin,
            likeStatus
        });
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id);
    }
};
