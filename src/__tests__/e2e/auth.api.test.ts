import request from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import {constants} from 'http2';

import {app} from "../../index";
import {CreateUserInputModel} from "../../models/UserModels/CreateUserInputModel";
import {GetMappedUserOutputModel} from '../../models/UserModels/GetUserOutputModel';
import {getEncodedAuthToken} from "../../helpers";


describe('/auth', () => {
    const adminBasicToken = getEncodedAuthToken();
    const createUser = async (input: CreateUserInputModel = {
        login: 'login12',
        email: 'example@gmail.com',
        password: 'pass123',
    }) => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${adminBasicToken}`)
            .send(input)
            .expect(constants.HTTP_STATUS_CREATED)

        const createdUser: GetMappedUserOutputModel = createResponse?.body;
        return createdUser;
    };

    let mongoMemoryServer: MongoMemoryServer

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create();
        const mongoUri = mongoMemoryServer.getUri();
        process.env['MONGO_URI'] = mongoUri;
    })

    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(constants.HTTP_STATUS_NO_CONTENT)
    }, 10000)

    const invalidInputData = {
        loginOrEmail1: {password: 'pass123'},
        loginOrEmail2: {loginOrEmail: '', password: 'pass123'},
        loginOrEmail3: {loginOrEmail: ' ', password: 'pass123'},
        loginOrEmail4: {loginOrEmail: 1, password: 'pass123'},
        loginOrEmail5: {loginOrEmail: false, password: 'pass123'},

        password1: {loginOrEmail: 'login12'},
        password2: {loginOrEmail: 'login12', password: ''},
        password3: {loginOrEmail: 'login12', password: ' '},
        password4: {loginOrEmail: 'login12', password: 1},
        password5: {loginOrEmail: 'login12', password: false},
    }

    // testing clear all data api
    it('should remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(constants.HTTP_STATUS_NO_CONTENT)
    })

    // testing get '/auth/me' api
    it('should return 401 for not auth user', async () => {
        await request(app)
            .get('/auth/me')
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)
    })
    it(
        'should return 200 and access token of current auth user if loginOrEmail and password are correct',
        async () => {
            const createdUser = await createUser();
            const authData = await request(app)
                .post('/auth/login')
                .send({loginOrEmail: 'example@gmail.com', password: 'pass123'})
                .expect(constants.HTTP_STATUS_OK)

            const {accessToken} = authData?.body || {};

            await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(
                    constants.HTTP_STATUS_OK,
                    {
                        email: createdUser.email,
                        login: createdUser.login,
                        userId: createdUser.id,
                    }
                )
        })

    // testing post '/auth/login' api
    it(`should return 401 if the password or login is wrong`, async () => {
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'login12', password: 'pass123'})
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)

        await createUser();

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'login123', password: 'pass123'})
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'login12', password: 'pass1234'})
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'example2@gmail.com', password: 'pass1234'})
            .expect(constants.HTTP_STATUS_UNAUTHORIZED)
    })
    it(`shouldn't login with incorrect input data`, async () => {
        await createUser();

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail1)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail2)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail3)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail4)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail5)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password1)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password2)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password3)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password4)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password5)
            .expect(constants.HTTP_STATUS_BAD_REQUEST)
    })
    it(`should auth with correct input data`, async () => {
        await createUser();
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'example@gmail.com', password: 'pass123'})
            .expect(constants.HTTP_STATUS_OK)
    })

});