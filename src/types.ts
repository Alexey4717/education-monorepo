import {Request} from 'express';

import {GetMappedVideoOutputModel} from "./models/VideoModels/GetVideoOutputModel";
import {GetMappedBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetMappedPostOutputModel} from "./models/PostModels/GetPostOutputModel";
import {SortBlogsBy} from "./models/BlogModels/GetBlogsInputModel";
import {SortPostsBy} from "./models/PostModels/GetPostsInputModel";


export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    NOT_FOUND_404 = 404,
    BAD_REQUEST_400 = 400,
    NOT_AUTH_401 = 401,
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

export enum SortDirections {
    desc = 'desc',
    asc = 'asc'
}

type User = {
    id: number
    login: string
    password: string
};

type CommonQueryParamsTypes = {
    sortDirection: SortDirections
    pageNumber: number
    pageSize: number
};

export type GetBlogsArgs = CommonQueryParamsTypes & {
    searchNameTerm: string | null
    sortBy: SortBlogsBy
};

export type GetPostsArgs = CommonQueryParamsTypes & {
    sortBy: SortPostsBy
};

export type GetPostsInBlogArgs = GetPostsArgs & {
    blogId: string
}

export type DataBase = {
    users: User[]
    videos: GetMappedVideoOutputModel[]
    blogs: GetMappedBlogOutputModel[]
    posts: GetMappedPostOutputModel[]
};

export type Error = {
    message: string
    field: string
};

export type CommonResponse<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
};

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParamsAndQuery<T, B> = Request<T, {}, {}, B>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;