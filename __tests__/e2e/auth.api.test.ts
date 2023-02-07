import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUSES} from '../../src/types/common'
import {CreateUserInputModel} from "../../src/models/UserModels/CreateUserInputModel";
import {GetMappedUserOutputModel} from '../../src/models/UserModels/GetUserOutputModel';
import {getEncodedAuthToken} from "../../src/helpers";

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
            .expect(HTTP_STATUSES.CREATED_201)

        const createdUser: GetMappedUserOutputModel = createResponse?.body;
        return createdUser;
    };

    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    const invalidInputData = {
        loginOrEmail1: {password: 'pass123'},
        loginOrEmail2: {loginOrEmail1: '', password: 'pass123'},
        loginOrEmail3: {loginOrEmail1: ' ', password: 'pass123'},
        loginOrEmail4: {loginOrEmail1: 1, password: 'pass123'},
        loginOrEmail5: {loginOrEmail1: false, password: 'pass123'},

        password1: {loginOrEmail1: 'login12'},
        password2: {loginOrEmail1: 'login12', password: ''},
        password3: {loginOrEmail1: 'login12', password: ' '},
        password4: {loginOrEmail1: 'login12', password: 1},
        password5: {loginOrEmail1: 'login12', password: false},
    }

    // testing clear all data api
    it('should remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    // testing get '/auth/me' api
    it('should return 401 for not auth user', async () => {
        await request(app)
            .get('/auth/me')
            .expect(HTTP_STATUSES.NOT_AUTH_401)
    })
    it(
        'should return 200 and access token of current auth user if loginOrEmail and password are correct',
        async () => {
            const createdUser = await createUser();
            const authData = await request(app)
                .post('/auth/login')
                .send({loginOrEmail: 'example@gmail.com', password: 'pass123'})
                .expect(HTTP_STATUSES.OK_200)

            const {accessToken} = authData?.body || {};

            await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(
                    HTTP_STATUSES.OK_200,
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
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await createUser();

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'login123', password: 'pass123'})
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'login12', password: 'pass1234'})
            .expect(HTTP_STATUSES.NOT_AUTH_401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'example2@gmail.com', password: 'pass1234'})
            .expect(HTTP_STATUSES.NOT_AUTH_401)
    })
    it(`shouldn't login with incorrect input data`, async () => {
        await createUser();

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail3)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail4)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.loginOrEmail5)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password3)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password4)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post('/auth/login')
            .send(invalidInputData.password5)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })
    it(`should auth with correct input data`, async () => {
        await createUser();
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'example@gmail.com', password: 'pass123'})
            .expect(HTTP_STATUSES.OK_200)
    })

});