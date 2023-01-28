import {GetVideoOutputModelFromMongoDB, GetMappedVideoOutputModel} from "./models/VideoModels/GetVideoOutputModel";
import {GetBlogOutputModelFromMongoDB, GetMappedBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModelFromMongoDB, GetMappedPostOutputModel} from "./models/PostModels/GetPostOutputModel";
import {AvailableResolutions} from './types';
import {db} from "./store/mockedDB";

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
})

export const getMappedBlogViewModel = ({
                                           _id,
                                           name,
                                           description,
                                           websiteUrl,
                                           createdAt
                                       }: GetBlogOutputModelFromMongoDB): GetMappedBlogOutputModel => ({
    id: _id.toString(),
    name,
    description,
    websiteUrl,
    createdAt
})

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
})

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
