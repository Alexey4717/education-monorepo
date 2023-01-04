import express from 'express'


export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,
}

type Course = {
    id: number;
    title: string
}

const db: { courses: Course[] } = {
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

app.get('/', (req, res) => {
    res.json({message: 'home page'})
})

app.get('/courses', (req, res) => {
    let foundCourses = db.courses

    if (req.query.title) {
        foundCourses = foundCourses
            .filter((course) => course.title.indexOf(req.query.title as string) > -1)
    }

    res.json(foundCourses)
})
app.get('/courses/:id', (req, res) => {
    const {id: courseId} = req.params || {}

    if (!courseId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const foundCourse = db.courses.find((course) => course?.id === +courseId)
    if (foundCourse) {
        res.json(foundCourse)
    } else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

})

app.post('/courses', (req, res) => {
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

app.delete('/courses/:id', (req, res) => {
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
app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req, res) => {
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