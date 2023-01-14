import request from "supertest";

import {app} from "../../src/index";
import {HTTP_STATUSES} from '../../src/types';
import {CreateBlogInputModel} from '../../src/models/BlogModels/CreateBlogInputModel';
import {getEncodedAuthToken} from "../../src/helpers";
import {GetBlogOutputModel} from "../../src/models/BlogModels/GetBlogOutputModel";


describe('/blog', () => {
    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

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

    const invalidInputData = {
        name1: {description: 'description', websiteUrl: 'https://google.com'},
        name2: {name: '', description: 'description', websiteUrl: 'https://google.com'},
        name3: {name: '   ', description: 'description', websiteUrl: 'https://google.com'},
        name4: {name: 'qwertyuiopasdfgh', description: 'description', websiteUrl: 'https://google.com'},
        name5: {name: 1, description: 'description', websiteUrl: 'https://google.com'},
        name6: {name: false, description: 'description', websiteUrl: 'https://google.com'},

        description1: {name: 'name', websiteUrl: 'https://google.com'},
        description2: {name: 'name', description: '', websiteUrl: 'https://google.com'},
        description3: {name: 'name', description: '   ', websiteUrl: 'https://google.com'},
        description4: {name: 'name', description: new Array(502).join("a"), websiteUrl: 'https://google.com'},
        description5: {name: 'name', description: 1, websiteUrl: 'https://google.com'},
        description6: {name: 'name', description: false, websiteUrl: 'https://google.com'},

        websiteUrl1: {name: 'name', description: 'description'},
        websiteUrl2: {name: 'name', description: 'description', websiteUrl: ''},
        websiteUrl3: {name: 'name', description: 'description', websiteUrl: '   '},
        websiteUrl4: {name: 'name', description: 'description', websiteUrl: new Array(102).join("a")},
        websiteUrl5: {name: 'name', description: 'description', websiteUrl: 1},
        websiteUrl6: {name: 'name', description: 'description', websiteUrl: false},
        websiteUrl7: {name: 'name', description: 'description', websiteUrl: 'not url string'},

        notExistKey: {"nam": "name", name: 'name', description: 'description', websiteUrl: 'https://google.com'},
    }

    // testing get '/blogs' api
    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it('should return 200 and array of blogs', async () => {
        const input1: CreateBlogInputModel = {
            name: 'blog1',
            description: 'about blog1',
            websiteUrl: 'https://google.com'
        };
        const createdBlog1 = await createBlog(input1);

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdBlog1]);

        const input2: CreateBlogInputModel = {
            name: 'blog2',
            description: 'about blog2',
            websiteUrl: 'https://yandex.ru'
        };

        const createdBlog2 = await createBlog(input2);

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdBlog1, createdBlog2]);
    })

    // testing get '/blogs/:id' api
    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/-99')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it('should return 200 and existing blog', async () => {
        const createdBlog = await createBlog();

        await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    })

    // testing delete '/blogs/:id' api
    it('should return 401 for not auth user', async () => {
        await request(app)
            .delete('/blogs/-99')
            .expect(HTTP_STATUSES.NOT_AUTH_401)
    })
    it('should return 404 for not existing blog', async () => {
        await request(app)
            .delete('/blogs/-99')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it('should return 204 for existing blog', async () => {
        const createdBlog = await createBlog();
        await request(app)
            .delete(`/blogs/${createdBlog.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    // testing post '/blogs' api
    it(`shouldn't create blog if not auth user`, async () => {
        const input: CreateBlogInputModel = {
            name: 'blog1',
            description: 'about blog1',
            websiteUrl: 'https://google.com'
        };
        await request(app)
            .post('/blogs')
            .send(input)
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`shouldn't create blog with incorrect input data`, async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.name1)
            .send(invalidInputData.name2)
            .send(invalidInputData.name3)
            .send(invalidInputData.name4)
            .send(invalidInputData.name5)
            .send(invalidInputData.name6)
            .send(invalidInputData.description1)
            .send(invalidInputData.description2)
            .send(invalidInputData.description3)
            .send(invalidInputData.description4)
            .send(invalidInputData.description5)
            .send(invalidInputData.description6)
            .send(invalidInputData.websiteUrl1)
            .send(invalidInputData.websiteUrl2)
            .send(invalidInputData.websiteUrl3)
            .send(invalidInputData.websiteUrl4)
            .send(invalidInputData.websiteUrl5)
            .send(invalidInputData.websiteUrl6)
            .send(invalidInputData.websiteUrl7)
            .send(invalidInputData.notExistKey)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`should create blog with correct input data`, async () => {
        const input: CreateBlogInputModel = {
            name: 'blog1',
            description: 'about blog1',
            websiteUrl: 'https://google.com'
        };
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdBlog: GetBlogOutputModel = createResponse?.body;
        const expectedBlog: GetBlogOutputModel = {
            ...input,
            id: createdBlog.id,
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl
        };

        expect(createdBlog).toEqual(expectedBlog);

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdBlog])
    })

    // testing put '/blogs/:id' api
    it(`shouldn't update blog if not auth user`, async () => {
        const createdBlog = await createBlog();
        const input: CreateBlogInputModel = {
            name: 'blog3',
            description: 'about blog1',
            websiteUrl: 'https://google.com'
        };
        await request(app)
            .put(`/blogs/${createdBlog?.id}`)
            .send(input)
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdBlog])
    })
    it(`shouldn't update blog with incorrect input data`, async () => {
        const createdBlog = await createBlog();
        await request(app)
            .put(`/blogs/${createdBlog?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(invalidInputData.name1)
            .send(invalidInputData.name2)
            .send(invalidInputData.name3)
            .send(invalidInputData.name4)
            .send(invalidInputData.name5)
            .send(invalidInputData.name6)
            .send(invalidInputData.description1)
            .send(invalidInputData.description2)
            .send(invalidInputData.description3)
            .send(invalidInputData.description4)
            .send(invalidInputData.description5)
            .send(invalidInputData.description6)
            .send(invalidInputData.websiteUrl1)
            .send(invalidInputData.websiteUrl2)
            .send(invalidInputData.websiteUrl3)
            .send(invalidInputData.websiteUrl4)
            .send(invalidInputData.websiteUrl5)
            .send(invalidInputData.websiteUrl6)
            .send(invalidInputData.websiteUrl7)
            .send(invalidInputData.notExistKey)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdBlog])
    })
    it(`shouldn't update blog if not exist`, async () => {
        const input: CreateBlogInputModel = {
            name: 'blog3',
            description: 'about blog1',
            websiteUrl: 'https://google.com'
        };
        await request(app)
            .put('/blogs/-9999')
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(input)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`should update blog with correct input data`, async () => {
        const dataForCreate: CreateBlogInputModel = {
            name: 'blog1',
            description: 'about blog1',
            websiteUrl: 'https://google.com'
        };
        const createdBlog = await createBlog(dataForCreate);

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdBlog])

        const dataForUpdate: CreateBlogInputModel = {
            name: 'blog3',
            description: 'about blog3',
            websiteUrl: 'https://yandex.ru'
        };

        await request(app)
            .put(`/blogs/${createdBlog?.id}`)
            .set('Authorization', `Basic ${encodedBase64Token}`)
            .send(dataForUpdate)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const updatedBlog = {...createdBlog, ...dataForUpdate};

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [updatedBlog])
    })

});