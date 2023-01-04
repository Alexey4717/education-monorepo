import request from 'supertest'
import {app, HTTP_STATUSES} from "../../src"

describe('/course', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/__test__/data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for existing course', async () => {
        await request(app)
            .get('/courses/99')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create course with incorrect input data`, async () => {
        await request(app)
            .post('/courses')
            .send({ title: ' ' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`should create course with correct input data`, async () => {
        const title = 'new course'
        const createResponse = await request(app)
            .post('/courses')
            .send({ title })
            .expect(HTTP_STATUSES.CREATED_201)

        const createdCourse = createResponse?.body

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse])
    })

    it(`shouldn't update course with incorrect input data`, async () => {
        const title = 'new course'
        const createResponse = await request(app)
            .post('/courses')
            .send({ title })
            .expect(HTTP_STATUSES.CREATED_201)

        const createdCourse = createResponse?.body

        await request(app)
            .put(`/courses/${createdCourse?.id}`)
            .send({ title: ' ' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse])
    })

    it(`shouldn't update course if not exist`, async () => {
        await request(app)
            .put('/courses/-9999')
            .send({ title: 'update course' })
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`should update course with correct input data`, async () => {
        const createdTitle = 'new course'
        const updatedTitle = 'update course'
        const createResponse = await request(app)
            .post('/courses')
            .send({ title: createdTitle })
            .expect(HTTP_STATUSES.CREATED_201)

        const createdCourse = createResponse.body

        await request(app)
            .put(`/courses/${createdCourse?.id}`)
            .send({ title: updatedTitle })
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const updatedCourse = { ...createdCourse, title: updatedTitle }

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [updatedCourse])
    })

})