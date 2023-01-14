import request from "supertest";

import {app} from "../../src/index";
import {HTTP_STATUSES} from '../../src/types';
import {db} from '../../src/store/mockedDB';
import {CreatePostInputModel} from '../../src/models/PostModels/CreatePostInputModel';
import {getEncodedAuthToken} from "../../src/helpers";
import {GetPostOutputModel} from "../../src/models/PostModels/GetPostOutputModel";
import {CreateBlogInputModel} from "../../src/models/BlogModels/CreateBlogInputModel";
import {GetBlogOutputModel} from "../../src/models/BlogModels/GetBlogOutputModel";


describe('/blog', () => {
    const encodedBase64Token = getEncodedAuthToken();

    const createPost = async (input: CreatePostInputModel | undefined = {
        title: 'title',
        blogId: db.blogs[0].id,
        content: 'content',
        shortDescription: 'shortDescription'
    }) => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdPost: GetPostOutputModel = createResponse?.body;
        return createdPost;
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

        const createdBlog: GetBlogOutputModel = createResponse?.body;
        return createdBlog;
    }

    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await createBlog();
    })

    const invalidInputData = {
        title1: {shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},
        title2: {title: '', shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},
        title3: {title: '   ', shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},
        title4: {title: new Array(32).join("a"), shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},
        title5: {title: 1, shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},
        title6: {title: false, shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},

        shortDescription1: {title: 'title', content: 'content', blogId: '123'},
        shortDescription2: {title: 'title', shortDescription: '', content: 'content', blogId: db.blogs[0].id},
        shortDescription3: {title: 'title', shortDescription: '   ', content: 'content', blogId: db.blogs[0].id},
        shortDescription4: {title: 'title', shortDescription: new Array(102).join("a"), content: 'content', blogId: db.blogs[0].id},
        shortDescription5: {title: 'title', shortDescription: 1, content: 'content', blogId: db.blogs[0].id},
        shortDescription6: {title: 'title', shortDescription: false, content: 'content', blogId: db.blogs[0].id},

        content1: {title: 'title', shortDescription: 'shortDescription', blogId: db.blogs[0].id},
        content2: {title: 'title', shortDescription: 'shortDescription', content: '', blogId: db.blogs[0].id},
        content3: {title: 'title', shortDescription: 'shortDescription', content: '   ', blogId: db.blogs[0].id},
        content4: {title: 'title', shortDescription: 'shortDescription', content: new Array(1002).join("a"), blogId: db.blogs[0].id},
        content5: {title: 'title', shortDescription: 'shortDescription', content: 1, blogId: db.blogs[0].id},
        content6: {title: 'title', shortDescription: 'shortDescription', content: false, blogId: db.blogs[0].id},

        blogId1: {title: 'title', shortDescription: 'shortDescription', content: 'content'},
        blogId2: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: ''},
        blogId3: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: '   '},
        blogId4: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: 123},
        blogId5: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: false},
        blogId6: {title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: '-999'}, // not exists blog

        notExistKey: {tit: 'title', title: 'title', shortDescription: 'shortDescription', content: 'content', blogId: db.blogs[0].id},
    }

    // testing get '/posts' api
    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it('should return 200 and array of posts', async () => {
        const input1: CreatePostInputModel = {
            title: 'title',
            blogId: db.blogs[0].id,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createdPost1 = await createPost(input1);

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost1]);

        const input2: CreatePostInputModel = {
            title: 'title2',
            blogId: db.blogs[0].id,
            content: 'content2',
            shortDescription: 'shortDescription2'
        };

        const createdPost2 = await createPost(input2);

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost1, createdPost2]);
    })

    // testing get '/posts/:id' api
    it('should return 404 for not existing post', async () => {
        await request(app)
            .get('/posts/-99')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it('should return 200 and existing posts', async () => {
        const createdpost = await createPost();

        await request(app)
            .get(`/posts/${createdpost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdpost)
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
        const createdPost = await createPost();
        await request(app)
            .delete(`/posts/${createdPost.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    // testing post '/posts' api
    it(`shouldn't create post if not auth user`, async () => {
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: db.blogs[0].id,
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
            .send(invalidInputData.title1)
            .send(invalidInputData.title2)
            .send(invalidInputData.title3)
            .send(invalidInputData.title4)
            .send(invalidInputData.title5)
            .send(invalidInputData.title6)
            .send(invalidInputData.shortDescription1)
            .send(invalidInputData.shortDescription2)
            .send(invalidInputData.shortDescription3)
            .send(invalidInputData.shortDescription4)
            .send(invalidInputData.shortDescription5)
            .send(invalidInputData.shortDescription6)
            .send(invalidInputData.content1)
            .send(invalidInputData.content2)
            .send(invalidInputData.content3)
            .send(invalidInputData.content4)
            .send(invalidInputData.content5)
            .send(invalidInputData.content6)
            .send(invalidInputData.blogId1)
            .send(invalidInputData.blogId2)
            .send(invalidInputData.blogId3)
            .send(invalidInputData.blogId4)
            .send(invalidInputData.blogId5)
            .send(invalidInputData.blogId6)
            .send(invalidInputData.notExistKey)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`should create post with correct input data`, async () => {
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: db.blogs[0].id,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdPost: GetPostOutputModel = createResponse?.body;
        const expectedPost: GetPostOutputModel = {
            ...input,
            id: createdPost.id,
            title: createdPost.title,
            blogId: createdPost.blogId,
            content: createdPost.content,
            shortDescription: createdPost.shortDescription,
            blogName: createdPost.blogName
        };

        expect(createdPost).toEqual(expectedPost);

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])
    })

    // testing put '/posts/:id' api
    it(`shouldn't update post if not auth user`, async () => {
        const createdPost = await createPost();
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: db.blogs[0].id,
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
        const createdPost = await createPost();
        await request(app)
            .put(`/posts/${createdPost?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.title1)
            .send(invalidInputData.title2)
            .send(invalidInputData.title3)
            .send(invalidInputData.title4)
            .send(invalidInputData.title5)
            .send(invalidInputData.title6)
            .send(invalidInputData.shortDescription1)
            .send(invalidInputData.shortDescription2)
            .send(invalidInputData.shortDescription3)
            .send(invalidInputData.shortDescription4)
            .send(invalidInputData.shortDescription5)
            .send(invalidInputData.shortDescription6)
            .send(invalidInputData.content1)
            .send(invalidInputData.content2)
            .send(invalidInputData.content3)
            .send(invalidInputData.content4)
            .send(invalidInputData.content5)
            .send(invalidInputData.content6)
            .send(invalidInputData.blogId1)
            .send(invalidInputData.blogId2)
            .send(invalidInputData.blogId3)
            .send(invalidInputData.blogId4)
            .send(invalidInputData.blogId5)
            .send(invalidInputData.blogId6)
            .send(invalidInputData.notExistKey)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])
    })
    it(`shouldn't update post if not exist`, async () => {
        const input: CreatePostInputModel = {
            title: 'title',
            blogId: db.blogs[0].id,
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
        const dataForCreate: CreatePostInputModel = {
            title: 'title',
            blogId: db.blogs[0].id,
            content: 'content',
            shortDescription: 'shortDescription'
        };
        const createdPost = await createPost(dataForCreate);

        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [createdPost])

        const dataForUpdate: CreatePostInputModel = {
            title: 'title2',
            blogId: db.blogs[0].id,
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