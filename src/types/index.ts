import type {Request} from 'express';
import {CourseOutputModel} from "./models/CourseOutputModel";

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,
}

export type DataBase = {
    courses: CourseOutputModel[]
}

export type RequestWithUriParams<T> = Request<T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithBody<T> = Request<{}, {}, T>