import {GetVideoOutputModelFromMongoDB, GetMappedVideoOutputModel} from "./models/VideoModels/GetVideoOutputModel";
import {GetBlogOutputModelFromMongoDB, GetMappedBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModelFromMongoDB, GetMappedPostOutputModel} from "./models/PostModels/GetPostOutputModel";
import {AvailableResolutions} from './types/common';
import {db} from "./store/mockedDB";
import {GetMappedUserOutputModel, GetUserOutputModelFromMongoDB} from "./models/UserModels/GetUserOutputModel";
import {MeOutputModel} from "./models/AuthModels/MeOutputModel";
import {
    GetCommentOutputModelFromMongoDB,
    GetMappedCommentOutputModel
} from "./models/CommentsModels/GetCommentOutputModel";


export const getMappedVideoViewModel = ({
                                            _id,
                                            title,
                                            author,
                                            canBeDownloaded,
                                            minAgeRestriction,
                                            createdAt,
                                            publicationDate,
                                            availableResolutions
                                        }: GetVideoOutputModelFromMongoDB): GetMappedVideoOutputModel => ({
    id: _id.toString(),
    title,
    author,
    canBeDownloaded,
    minAgeRestriction,
    createdAt,
    publicationDate,
    availableResolutions
});

export const getMappedBlogViewModel = ({
                                           _id,
                                           name,
                                           description,
                                           websiteUrl,
                                           isMembership,
                                           createdAt
                                       }: GetBlogOutputModelFromMongoDB): GetMappedBlogOutputModel => ({
    id: _id.toString(),
    name,
    description,
    websiteUrl,
    isMembership,
    createdAt
});

export const getMappedPostViewModel = ({
                                           _id,
                                           title,
                                           content,
                                           shortDescription,
                                           blogName,
                                           blogId,
                                           createdAt
                                       }: GetPostOutputModelFromMongoDB): GetMappedPostOutputModel => ({
    id: _id.toString(),
    title,
    content,
    shortDescription,
    blogName,
    blogId,
    createdAt
});

export const getMappedUserViewModel = ({
                                           _id,
                                           accountData,
                                       }: GetUserOutputModelFromMongoDB): GetMappedUserOutputModel => ({
    id: _id.toString(),
    login: accountData.login,
    email: accountData.email,
    createdAt: accountData.createdAt
});

export const getMappedMeViewModel = ({
                                         _id,
                                         accountData,
                                     }: GetUserOutputModelFromMongoDB): MeOutputModel => ({
    email: accountData.email,
    login: accountData.login,
    userId: _id.toString(),
});

export const getMappedCommentViewModel = ({
                                         _id,
                                         content,
                                         commentatorInfo,
                                         createdAt
                                     }: GetCommentOutputModelFromMongoDB): GetMappedCommentOutputModel => {
    const {userId, userLogin} = commentatorInfo || {};
    return {
        id: _id.toString(),
        content,
        commentatorInfo: {
            userId,
            userLogin
        },
        createdAt
    }
};

export const getCorrectIncludesAvailableResolutions = (availableResolutions: AvailableResolutions[]): boolean => {
    const enumValues = Object.values(AvailableResolutions)
    const intersections = availableResolutions
        .filter((key) => !enumValues.includes(key));
    return Boolean(intersections.length);
};

export const getEncodedAuthToken = () => {
    return Buffer
        .from(`${db.users[0].login}:${db.users[0].password}`, 'utf-8')
        .toString('base64');
};

type CalculateAndGetSkipValueArgs = {
    pageNumber: number
    pageSize: number
};

export const calculateAndGetSkipValue = ({pageNumber, pageSize}: CalculateAndGetSkipValueArgs) => {
    return (pageNumber - 1) * pageSize;
};
