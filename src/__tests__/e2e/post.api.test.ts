import request from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import {ObjectId} from 'mongodb';
import {constants} from "http2";

import {index} from "../../index";
import {CreatePostInputModel} from '../../models/PostModels/CreatePostInputModel';
import {getEncodedAuthToken} from "../../helpers";
import {GetMappedPostOutputModel} from "../../models/PostModels/GetPostOutputModel";
import {CreateBlogInputModel} from "../../models/BlogModels/CreateBlogInputModel";
import {GetMappedBlogOutputModel} from "../../models/BlogModels/GetBlogOutputModel";
import {CreateUserInputModel} from "../../models/UserModels/CreateUserInputModel";
import {GetMappedUserOutputModel} from "../../models/UserModels/GetUserOutputModel";
import {LoginInputModel} from "../../models/AuthModels/LoginInputModel";


const mockedcreatedBlogId = new ObjectId().toString();

export const invalidInputData = {
    title1: {shortDescription: 'shortDescription', content: 'content', blogId: mockedcreatedBlogId},
    title2: {title: '', shortDescription: 'shortDescription', content: 'content', blogId: mockedcreatedBlogId},
    title3: {title: '   ', shortDescription: 'shortDescription', content: 'content', blogId: mockedcreatedBlogId},
    title4: {
        title: new Array(32).join("a"),
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: mockedcreatedBlogId
    },
    title5: {title: 1, shortDescription: 'shortDescription', content: 'content', blogId: mockedcreatedBlogId},
    title6: {title: false, shortDescription: 'shortDescription', content: 'content', blogId: mockedcreatedBlogId},

    shortDescription1: {title: 'title', content: 'content', blogId: mockedcreatedBlogId},
    shortDescription2: {title: 'title', shortDescription: '', content: 'content', blogId: mockedcreatedBlogId},
    shortDescription3: {title: 'title', shortDescription: '   ', content: 'content', blogId: mockedcreatedBlogId},
    shortDescription4: {
        title: 'title',
        shortDescription: new Array(102).join("a"),
        content: 'content',
        blogId: mockedcreatedBlogId
    },
    shortDescription5: {title: 'title', shortDescription: 1, content: 'content', blogId: mockedcreatedBlogId},
    shortDescription6: {title: 'title', shortDescription: false, content: 'content', blogId: mockedcreatedBlogId},

    content1: {title: 'title', shortDescription: 'shortDescription', blogId: mockedcreatedBlogId},
    content2: {title: 'title', shortDescription: 'shortDescription', content: '', blogId: mockedcreatedBlogId},
    content3: {title: 'title', shortDescription: 'shortDescription', content: '   ', blogId: mockedcreatedBlogId},
    content4: {
        title: 'title',
        shortDescription: 'shortDescription',
        content: new Array(1002).join("a"),
        blogId: mockedcreatedBlogId
    },
    content5: {title: 'title', shortDescription: 'shortDescription', content: 1, blogId: mockedcreatedBlogId},
    content6: {title: 'title', shortDescription: 'shortDescription', content: false, blogId: mockedcreatedBlogId},

    blogId1: {title: 'title', shortDescription: 'shortDescription', content: 'content'},
    blogId2: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: ''},
    blogId3: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: '   '},
    blogId4: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: 123},
    blogId5: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: false},
    blogId6: {
        title: 'title',
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: '63cde53de1eeeb34059bda94'
    }, // not exists blog

    // for testing comments
    comment1: {},
    comment2: {content: ''},
    comment3: {content: ' '},
    comment4: {content: true},
    comment5: {content: new Array(20).join("a")},
    comment6: {content: new Array(302).join("a")},
}

describe('/post', () => {
    const encodedBase64Token = getEncodedAuthToken();
    const notExistingId = new ObjectId();

    const createUser = async (input: CreateUserInputModel = {
        login: 'login12',
        email: 'example@gmail.com',
        password: 'pass123',
    }) => {
        const createResponse = await request(index)
            .post('/users')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(constants.HTTP_STATUS_CREATED)

        const createdUser: GetMappedUserOutputModel = createResponse?.body;
        return createdUser;
    };

    const createBlog = async (input: CreateBlogInputModel | undefined = {
        name: 'blog1',
        description: 'about blog1',
        websiteUrl: 'https://google.com'
    }) => {
        const createResponse = await request(index)
            .post('/blogs')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(constants.HTTP_STATUS_CREATED)

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

        const createResponse = await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...defaultPayload, blogId})
            .expect(constants.HTTP_STATUS_CREATED)

        const createdPost: GetMappedPostOutputModel = createResponse?.body;
        return createdPost;
    }

    let mongoMemoryServer: MongoMemoryServer

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create()
        const mongoUri = mongoMemoryServer.getUri()
        process.env['MONGO_URI'] = mongoUri
    })

    beforeEach(async () => {
        await request(index)
            .delete('/testing/all-data')
            .expect(constants.HTTP_STATUS_NO_CONTENT)

        await createBlog();
    })

    // testing get '/posts' api
    it('should return 200 and empty array', async () => {
        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })
    it('should return 200 and array of posts', async () => {
        const createdBlogId = await getCreatedBlogId();
        const input1: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createdPost1 = await createPost(createdBlogId);

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost1]
            });

        const input2: CreatePostInputModel = {
            title: 'title2',
            blogId: createdBlogId,
            content: 'content2',
            shortDescription: 'shortDescription2'
        };

        const createdPost2 = await createPost(createdBlogId);

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdPost2, createdPost1]
            });
    })
    it('should return 200 and array of blogs sorted by specified field with sortDirection', async () => {
        const createdBlogId = await getCreatedBlogId();

        const input1: CreatePostInputModel = {
            title: 'Alex',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'Align items'
        };
        const createdPost1 = await createPost(createdBlogId, input1);

        const input2: CreatePostInputModel = {
            title: 'John',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'About flowers'
        };
        const createdPost2 = await createPost(createdBlogId, input2);

        const input3: CreatePostInputModel = {
            title: 'Zed',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'ChatGPT'
        };
        const createdPost3 = await createPost(createdBlogId, input3);

        const input4: CreatePostInputModel = {
            title: 'Ben',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'Building'
        };
        const createdPost4 = await createPost(createdBlogId, input4);

        await request(index)
            .get('/posts?sortBy=title')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [createdPost3, createdPost2, createdPost4, createdPost1]
            });

        await request(index)
            .get('/posts?sortBy=shortDescription&sortDirection=asc')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [createdPost2, createdPost1, createdPost4, createdPost3]
            });
    })
    it('should return 200 and portion array of posts with page number and size', async () => {
        const createdBlogId = await getCreatedBlogId();

        const input1: CreatePostInputModel = {
            title: 'Alex',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'Align items'
        };
        const createdPost1 = await createPost(createdBlogId, input1);

        const input2: CreatePostInputModel = {
            title: 'John',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'About flowers'
        };
        const createdPost2 = await createPost(createdBlogId, input2);

        const input3: CreatePostInputModel = {
            title: 'Zed',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'ChatGPT'
        };
        const createdPost3 = await createPost(createdBlogId, input3);

        const input4: CreatePostInputModel = {
            title: 'Ben',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'Building'
        };
        const createdPost4 = await createPost(createdBlogId, input4);

        const input5: CreatePostInputModel = {
            title: 'Ben',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'Building'
        };
        const createdPost5 = await createPost(createdBlogId, input5);

        const input6: CreatePostInputModel = {
            title: 'Ben',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'Building'
        };
        const createdPost6 = await createPost(createdBlogId, input6);

        await request(index)
            .get('/posts')
            .expect(
                constants.HTTP_STATUS_OK,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 6,
                    items: [createdPost6, createdPost5, createdPost4, createdPost3, createdPost2, createdPost1]
                }
            );

        await request(index)
            .get('/posts?pageSize=4')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 2,
                page: 1,
                pageSize: 4,
                totalCount: 6,
                items: [createdPost6, createdPost5, createdPost4, createdPost3]
            });

        await request(index)
            .get('/posts?pageNumber=2&pageSize=2')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 3,
                page: 2,
                pageSize: 2,
                totalCount: 6,
                items: [createdPost4, createdPost3]
            });
    })

    // testing get '/posts/:id' api
    it('should return 404 for not existing post', async () => {
        await request(index)
            .get(`/posts/${notExistingId}`)
            .expect(constants.HTTP_STATUS_NOT_FOUND)
    })
    it('should return 200 and existing posts', async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);

        await request(index)
            .get(`/posts/${createdPost?.id}`)
            .expect(constants.HTTP_STATUS_OK, createdPost)
    })

    // testing delete '/posts/:id' api
    it('should return 401 for not auth user', async () => {
        await request(index)
            .delete(`/posts/${notExistingId}`)
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)
    })
    it('should return 404 for not existing post', async () => {
        await request(index)
            .delete(`/posts/${notExistingId}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(constants.HTTP_STATUS_NOT_FOUND)
    })
    it('should return 204 for existing post', async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);
        await request(index)
            .delete(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(constants.HTTP_STATUS_NO_CONTENT)
    })

    // testing post '/posts' api
    it(`shouldn't create post if not auth user`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        await request(index)
            .post('/posts')
            .send(input)
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })
    it(`shouldn't create post with incorrect input data`, async () => {
        const createdBlogId = await getCreatedBlogId();
        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title1, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title2, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title3, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title4, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title5, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title6, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription1, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription2, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription3, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription4, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription5, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription6, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content1, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content2, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content3, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content4, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content5, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content6, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId1)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId2)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId3)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId4)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId5)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId6)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })
    it(`should create post with correct input data`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createResponse = await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(constants.HTTP_STATUS_CREATED)

        const createdPost: GetMappedPostOutputModel = createResponse?.body;
        const expectedPost: GetMappedPostOutputModel = {
            ...input,
            id: createdPost?.id,
            title: createdPost.title,
            blogId: createdPost.blogId,
            content: createdPost.content,
            shortDescription: createdPost.shortDescription,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        };

        expect(createdPost).toEqual(expectedPost);

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost]
            })
    })

    // testing put '/posts/:id' api
    it(`shouldn't update post if not auth user`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .send(input)
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost]
            })
    })
    it(`shouldn't update post with incorrect input data`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title1, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title2, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title3, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title4, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title5, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title6, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription1, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription2, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription3, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription4, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription5, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription6, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content1, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content2, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content3, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content4, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content5, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content6, blogId: createdBlogId})
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId1)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId2)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId3)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId4)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId5)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId6)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost]
            })
    })
    it(`shouldn't update post if not exist`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        await request(index)
            .put(`/posts/${notExistingId}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(constants.HTTP_STATUS_NOT_FOUND)

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })
    it(`should update post with correct input data`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const dataForCreate: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createdPost = await createPost(createdBlogId);

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost]
            })

        const dataForUpdate: CreatePostInputModel = {
            title: 'title2',
            blogId: createdBlogId,
            content: 'content2',
            shortDescription: 'shortDescription2'
        };

        await request(index)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(dataForUpdate)
            .expect(constants.HTTP_STATUS_NO_CONTENT)

        const updatedPost = {...createdPost, ...dataForUpdate};

        await request(index)
            .get('/posts')
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [updatedPost]
            })
    })

});

describe('comments in post', () => {
    const encodedBase64Token = getEncodedAuthToken();
    const notExistingId = new ObjectId();

    const createUser = async (input: CreateUserInputModel = {
        login: 'login12',
        email: 'example@gmail.com',
        password: 'pass123',
    }) => {
        const createResponse = await request(index)
            .post('/users')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(constants.HTTP_STATUS_CREATED)

        const createdUser: GetMappedUserOutputModel = createResponse?.body;
        return createdUser;
    };

    const auth = async (input: LoginInputModel = {
        loginOrEmail: 'example@gmail.com',
        password: 'pass123'
    }) => {
        const {loginOrEmail, password} = input;
        const authData = await request(index)
            .post('/auth/login')
            .send({loginOrEmail, password})
            .expect(constants.HTTP_STATUS_OK)

        return authData.body.accessToken;
    }

    const createBlog = async (input: CreateBlogInputModel | undefined = {
        name: 'blog1',
        description: 'about blog1',
        websiteUrl: 'https://google.com'
    }) => {
        const createResponse = await request(index)
            .post('/blogs')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(constants.HTTP_STATUS_CREATED)

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

        const createResponse = await request(index)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...defaultPayload, blogId})
            .expect(constants.HTTP_STATUS_CREATED)

        const createdPost: GetMappedPostOutputModel = createResponse?.body;
        return createdPost;
    }

    let createdUser: GetMappedUserOutputModel;
    let accessToken: string;
    let createdBlogId: string;
    let createdPost: GetMappedPostOutputModel;

    beforeAll(async () => {
        createdUser = await createUser({
            password: 'password1',
            email: 'email1@mail.ru',
            login: 'login1'
        });
        accessToken = await auth({
            loginOrEmail: 'login1',
            password: 'password1'
        });
        createdBlogId = await getCreatedBlogId();
        createdPost = await createPost(createdBlogId);
    })

    // testing get '/posts/:postId/comments' api
    it(`should return 404 if post not exist`, async () => {
        await request(index)
            .get(`/posts/${notExistingId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(constants.HTTP_STATUS_NOT_FOUND)
    })
    it(`should return 200 and arrays of comments`, async () => {
        const createdComment1 = await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'Hello world, it`s my first comment!'})
            .expect(constants.HTTP_STATUS_CREATED)
        const createdComment2 = await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'Hello world, it`s my second comment!'})
            .expect(constants.HTTP_STATUS_CREATED)
        await request(index)
            .get(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(constants.HTTP_STATUS_OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdComment2.body, createdComment1.body]
            })
    })

    // testing post '/posts/:postId/comments' api
    it(`should return 401 if not auth`, async () => {
        const createdComment = await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .send({content: 'Hello world, it`s my first comment!'})
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)
    })
    it(`should return 201 and the newly created comment in post if correct input data`, async () => {
        const createdComment3 = await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'Hello world, it`s my third comment!'})
            .expect(constants.HTTP_STATUS_CREATED)

        const {
            id: commentId,
            createdAt
        } = createdComment3.body;

        expect(createdComment3.body.content).toBe('Hello world, it`s my third comment!');
        expect(createdComment3.body.commentatorInfo.userLogin).toBe('login1');
    })
    it(`shouldn't create comment in post if incorrect input data and return 400`, async () => {
        await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment1)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment2)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment3)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment4)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment5)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(index)
            .post(`/posts/${createdPost.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidInputData.comment6)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)
    })
    it(`should return 404 if post not exist`, async () => {
        await request(index)
            .post(`/posts/${notExistingId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'Hello world, it`s my first comment!'})
            .expect(constants.HTTP_STATUS_NOT_FOUND)
    })

});
