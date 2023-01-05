import express, { Request, Response } from 'express'

import {HTTP_STATUSES, DataBase, RequestWithQuery, RequestWithBody, RequestWithUriParams} from './types'
import {GetCoursesQueryModel} from "./types/models/GetCoursesQueryInputModel";
import {CourseCreateInputModel} from "./types/models/CourseCreateInputModel";
import {GetCourseUriParamsInputModel} from "./types/models/GetCourseUriParamsInputModel";
import {CourseOutputModel} from "./types/models/CourseOutputModel";


export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

const db: DataBase = {
    courses: [
        {
            id: 1,
            title: 'course_1'
        },
        {
            id: 2,
            title: 'course_2'
        }
    ]
}

app.get('/', (req: Request, res: Response) => {
    res.json({message: 'home page'})
})

app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModel>, res: Response<CourseOutputModel[]>) => {
    let foundCourses = db.courses

    if (req.query.title) {
        foundCourses = foundCourses
            .filter((course) => course.title.indexOf(req.query.title) > -1)
    }

    res.json(foundCourses)
})
app.get('/courses/:id', (req: RequestWithUriParams<GetCourseUriParamsInputModel>, res: Response<CourseOutputModel>) => {
    const courseId = req.params.id

    if (!courseId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const foundCourse = db.courses.find((course) => course?.id === +courseId)
    if (foundCourse) {
        res.json(foundCourse)
    } else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

app.post('/courses', (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseOutputModel>) => {
    if (!req.body.title || !req.body.title.trim()?.length) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    }

    db.courses.push(newCourse)
    res.status(HTTP_STATUSES.CREATED_201).json(newCourse)
})

app.delete('/courses/:id', (req: Request<{ id: string }>, res: Response<void>) => {
    const {id: courseId} = req.params || {}

    if (!courseId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const foundCourseIndex = db.courses.findIndex((course) => course?.id === +courseId)

    if (foundCourseIndex !== -1) {
        db.courses.splice(foundCourseIndex, 1)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
app.delete('/__test__/data', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req: Request<{ id: string }, {}, Pick<CourseOutputModel, 'title'>>, res: Response) => {
    const {id: courseId} = req.params || {}

    if (!courseId || !req.body.title || !req.body.title.trim()?.length) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const foundCourseIndex = db.courses.findIndex((course) => course?.id === +courseId)

    if (foundCourseIndex !== -1) {
        db.courses[foundCourseIndex].title = req.body.title
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

app.listen(port, () => {
    console.log('Example app listening on port ${port}')
})