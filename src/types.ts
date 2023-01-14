import {Request} from 'express';

import {GetVideoOutputModel} from "./models/VideoModels/GetVideoOutputModel";
import {GetBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModel} from "./models/PostModels/GetPostOutputModel";


export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    NOT_FOUND_404 = 404,
    BAD_REQUEST_400 = 400,
    NOT_AUTH_401 = 401,

    INTERNAL_ERROR_500 = 500
}

export enum AvailableResolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

type User = {
    id: number
    login: string
    password: string
};

export type DataBase = {
    users: User[]
    videos: GetVideoOutputModel[]
    blogs: GetBlogOutputModel[]
    posts: GetPostOutputModel[]
};

export type Error = {
    message: string
    field: string
};

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;