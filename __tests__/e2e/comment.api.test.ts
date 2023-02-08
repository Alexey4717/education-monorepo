import {getEncodedAuthToken} from "../../src/helpers";
import {ObjectId} from "mongodb";
import {CreateUserInputModel} from "../../src/models/UserModels/CreateUserInputModel";
import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/types/common";
import {GetMappedUserOutputModel} from "../../src/models/UserModels/GetUserOutputModel";
import {LoginInputModel} from "../../src/models/AuthModels/LoginInputModel";
import {CreateBlogInputModel} from "../../src/models/BlogModels/CreateBlogInputModel";
import {GetMappedBlogOutputModel} from "../../src/models/BlogModels/GetBlogOutputModel";
import {CreatePostInputModel} from "../../src/models/PostModels/CreatePostInputModel";
import {GetMappedPostOutputModel} from "../../src/models/PostModels/GetPostOutputModel";
import {invalidInputData} from "./post.api.test";
import {GetMappedCommentOutputModel} from "../../src/models/CommentsModels/GetCommentOutputModel";
import {MongoMemoryServer} from "mongodb-memory-server";


describe('CRUD comments', () => {
    jest.setTimeout(1000 * 60)
    const encodedBase64Token = getEncodedAuthToken();
    const notExistingId = new ObjectId();

    const createUser = async (input: CreateUserInputModel = {
        login: 'login12',
        email: 'example@gmail.com',
        password: 'pass123',
    }) => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdUser: GetMappedUserOutputModel = createResponse?.body;
        return createdUser;
    };

    const auth = async (input: LoginInputModel = {
        loginOrEmail: 'example@gmail.com',
        password: 'pass123'
    }) => {
        const {loginOrEmail, password} = input;
        const authData = await request(app)
            .post('/auth/login')
            .send({loginOrEmail: loginOrEmail,password: password})
            .expect(HTTP_STATUSES.OK_200)

        return authData.body.accessToken;
    }

    const createBlog = async (input: CreateBlogInputModel | undefined = {
        name: 'blog1',
        description: 'about blog1',
        websiteUrl: 'https://google.com'
    }) => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdBlog: GetMappedBlogOutputModel = createResponse?.body;
        return createdBlog;
    }

    const getCreatedBlogId = async () => {
        const result = await createBlog();
        const createdBlogId = result.id;
        return createdBlogId;
    };

    const createPost = async (blogId: string, input?: Omit<CreatePostInputModel, 'blogId'>) => {
        const defaultPayload = {
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
            ...input
        }

        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...defaultPayload, blogId})
            .expect(HTTP_STATUSES.CREATED_201)

        const createdPost: GetMappedPostOutputModel = createResponse?.body;
        return createdPost;
    }

    const createCommentInPost = async ({postId, content}: { postId: string, content: string }) => {
        const result = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content})
            .expect(HTTP_STATUSES.CREATED_201)
        return result.body;
    };

    let createdUser: GetMappedUserOutputModel;
    let createdUser2: GetMappedUserOutputModel;
    let accessToken: string;
    let otherUserAccessToken: string;
    let createdBlogId: string;
    let createdPost: GetMappedPostOutputModel;
    let createdComment: GetMappedCommentOutputModel;

    let mongoMemoryServer: MongoMemoryServer

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create()
        const mongoUri = mongoMemoryServer.getUri()
        process.env['MONGO_URI'] = mongoUri

        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        createdUser = await createUser({
            password: 'password1',
            email: 'email1@mail.ru',
            login: 'login1'
        });
        createdUser2 = await createUser({
            password: 'password12',
            email: 'email2@mail.ru',
            login: 'gggggg'
        });
        accessToken = await auth({
            loginOrEmail: 'login1',
            password: 'password1'
        });
        otherUserAccessToken = await auth ({
            loginOrEmail: 'gggggg',
            password: 'password12'
        })
        createdBlogId = await getCreatedBlogId();
        createdPost = await createPost(createdBlogId);
        createdComment = await createCommentInPost({
            postId: createdPost.id,
            content: 'Hello world, it`s my first comment!'
        })
    })

    // testing get '/comments/:commentId' api
    it(`should return 404 if comment not exist`, async () => {
        await request(app)
            .get(`/comments/${notExistingId}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should return 200 if comment exist`, async () => {
        await request(app)
            .get(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HTTP_STATUSES.OK_200)
    })

    // testing put '/comments/:commentId' api
    it(`should return 401 if not auth`, async () => {
        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .send({content: 'Hello world, it`s my second comment!'})
            .expect(HTTP_STATUSES.NOT_AUTH_401)
    })
    it(`should return 404 if comment not exist`, async () => {
        await request(app)
            .put(`/comments/${notExistingId}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'Hello world, it`s my second comment!'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should return 403 if comment not own user`, async () => {
        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${otherUserAccessToken}`)
            .send({content: 'Hello world, it`s my second comment!'})
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })
    it(`should return 204 if correct input data`, async () => {
        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'Hello world, it`s my other comment!'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    it(`should return 400 if incorrect input data`, async () => {
        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment3)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment4)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment5)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment6)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    // testing delete '/comments/:commentId' api
    it(`should return 401 if not auth`, async () => {
        await request(app)
            .delete(`/comments/${createdComment.id}/`)
            .expect(HTTP_STATUSES.NOT_AUTH_401)
    })
    it(`should return 404 if comment not exist`, async () => {
        await request(app)
            .delete(`/comments/${notExistingId}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should return 403 if comment not own user`, async () => {
        await request(app)
            .delete(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${otherUserAccessToken}`)
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })
    it(`should return 204 if comment exist`, async () => {
        await request(app)
            .delete(`/comments/${createdComment.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

})