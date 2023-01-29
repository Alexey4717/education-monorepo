import request from "supertest";

import {app} from "../../src/index";
import {HTTP_STATUSES} from '../../src/types';
import {CreatePostInputModel} from '../../src/models/PostModels/CreatePostInputModel';
import {getEncodedAuthToken} from "../../src/helpers";
import {GetMappedPostOutputModel} from "../../src/models/PostModels/GetPostOutputModel";
import {CreateBlogInputModel} from "../../src/models/BlogModels/CreateBlogInputModel";
import {GetBlogOutputModel} from "../../src/models/BlogModels/GetBlogOutputModel";


describe('/post', () => {
    const encodedBase64Token = getEncodedAuthToken();

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

        const createdBlog: GetBlogOutputModel = createResponse?.body;
        return createdBlog;
    }

    const getCreatedBlogId = async () => {
        await createBlog();

        const createdBlogs = await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200);
        const createdBlogId = createdBlogs.body[0].id

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

    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await createBlog();
    })

    const createdBlogId = "123";

    const invalidInputData = {
        title1: {shortDescription: 'shortDescription', content: 'content', blogId: createdBlogId},
        title2: {title: '', shortDescription: 'shortDescription', content: 'content', blogId: createdBlogId},
        title3: {title: '   ', shortDescription: 'shortDescription', content: 'content', blogId: createdBlogId},
        title4: {title: new Array(32).join("a"), shortDescription: 'shortDescription', content: 'content', blogId: createdBlogId},
        title5: {title: 1, shortDescription: 'shortDescription', content: 'content', blogId: createdBlogId},
        title6: {title: false, shortDescription: 'shortDescription', content: 'content', blogId: createdBlogId},

        shortDescription1: {title: 'title', content: 'content', blogId: '123'},
        shortDescription2: {title: 'title', shortDescription: '', content: 'content', blogId: createdBlogId},
        shortDescription3: {title: 'title', shortDescription: '   ', content: 'content', blogId: createdBlogId},
        shortDescription4: {title: 'title', shortDescription: new Array(102).join("a"), content: 'content', blogId: createdBlogId},
        shortDescription5: {title: 'title', shortDescription: 1, content: 'content', blogId: createdBlogId},
        shortDescription6: {title: 'title', shortDescription: false, content: 'content', blogId: createdBlogId},

        content1: {title: 'title', shortDescription: 'shortDescription', blogId: createdBlogId},
        content2: {title: 'title', shortDescription: 'shortDescription', content: '', blogId: createdBlogId},
        content3: {title: 'title', shortDescription: 'shortDescription', content: '   ', blogId: createdBlogId},
        content4: {title: 'title', shortDescription: 'shortDescription', content: new Array(1002).join("a"), blogId: createdBlogId},
        content5: {title: 'title', shortDescription: 'shortDescription', content: 1, blogId: createdBlogId},
        content6: {title: 'title', shortDescription: 'shortDescription', content: false, blogId: createdBlogId},

        blogId1: {title: 'title', shortDescription: 'shortDescription', content: 'content'},
        blogId2: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: ''},
        blogId3: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: '   '},
        blogId4: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: 123},
        blogId5: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: false},
        blogId6: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: '-999'}, // not exists blog
    }

    // testing get '/posts' api
    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
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

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost1]);

        const input2: CreatePostInputModel = {
            title: 'title2',
            blogId: createdBlogId,
            content: 'content2',
            shortDescription: 'shortDescription2'
        };

        const createdPost2 = await createPost(createdBlogId);

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost2, createdPost1]);
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

        await request(app)
            .get('/posts?sortBy=title')
            .expect(HTTP_STATUSES.OK_200, [createdPost3, createdPost2, createdPost4, createdPost1]);

        await request(app)
            .get('/posts?sortBy=shortDescription&sortDirection=asc')
            .expect(HTTP_STATUSES.OK_200, [createdPost2, createdPost1, createdPost4, createdPost3]);
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

        await request(app)
            .get('/posts')
            .expect(
                HTTP_STATUSES.OK_200,
                [createdPost6, createdPost5, createdPost4, createdPost3, createdPost2, createdPost1]
            );

        await request(app)
            .get('/posts?pageSize=4')
            .expect(HTTP_STATUSES.OK_200, [createdPost6, createdPost5, createdPost4, createdPost3]);

        await request(app)
            .get('/posts?pageNumber=2&pageSize=2')
            .expect(HTTP_STATUSES.OK_200, [createdPost4, createdPost3]);
    })

    // testing get '/posts/:id' api
    it('should return 404 for not existing post', async () => {
        await request(app)
            .get('/posts/-99')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it('should return 200 and existing posts', async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);

        await request(app)
            .get(`/posts/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)
    })

    // testing delete '/posts/:id' api
    it('should return 401 for not auth user', async () => {
        await request(app)
            .delete('/posts/-99')
            .expect(HTTP_STATUSES.NOT_AUTH_401)
    })
    it('should return 404 for not existing post', async () => {
        await request(app)
            .delete('/posts/-99')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it('should return 204 for existing post', async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);
        await request(app)
            .delete(`/posts/${createdPost.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
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
        await request(app)
            .post('/posts')
            .send(input)
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`shouldn't create post with incorrect input data`, async () => {
        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title1, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title2, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title3, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title4, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title5, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title6, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription1, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription2, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription3, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription4, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription5, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription6, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content1, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content2, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content3, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content4, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content5, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content6, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId3)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId4)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId5)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId6)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`should create post with correct input data`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdPost: GetMappedPostOutputModel = createResponse?.body;
        const expectedPost: GetMappedPostOutputModel = {
            ...input,
            id: createdPost.id,
            title: createdPost.title,
            blogId: createdPost.blogId,
            content: createdPost.content,
            shortDescription: createdPost.shortDescription,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        };

        expect(createdPost).toEqual(expectedPost);

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])
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
        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .send(input)
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])
    })
    it(`shouldn't update post with incorrect input data`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const createdPost = await createPost(createdBlogId);

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title1, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title2, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title3, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title4, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title5, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.title6, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription1, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription2, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription3, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription4, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription5, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.shortDescription6, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content1, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content2, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content3, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content4, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content5, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send({...invalidInputData.content6, blogId: createdBlogId})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId3)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId4)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId5)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.blogId6)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])
    })
    it(`shouldn't update post if not exist`, async () => {
        const createdBlogId = await getCreatedBlogId();
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: createdBlogId,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        await request(app)
            .put('/posts/-9999')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
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

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])

        const dataForUpdate: CreatePostInputModel = {
            title: 'title2',
            blogId: createdBlogId,
            content: 'content2',
            shortDescription: 'shortDescription2'
        };

        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(dataForUpdate)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const updatedPost = {...createdPost, ...dataForUpdate};

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [updatedPost])
    })

});