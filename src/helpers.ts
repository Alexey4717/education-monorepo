import {GetVideoOutputModel} from "./models/VideoModels/GetVideoOutputModel";
import {GetBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModel} from "./models/PostModels/GetPostOutputModel";
import {AvailableResolutions} from './types';
import {db} from "./store/mockedDB";

export const getVideoViewModel = ({
                                      id,
                                      title,
                                      author,
                                      canBeDownloaded,
                                      minAgeRestriction,
                                      createdAt,
                                      publicationDate,
                                      availableResolutions
                                  }: GetVideoOutputModel) => ({
    id,
    title,
    author,
    canBeDownloaded,
    minAgeRestriction,
    createdAt,
    publicationDate,
    availableResolutions
})

export const getBlogViewModel = ({
                                     id,
                                     name,
                                     description,
                                     websiteUrl,
                                     createdAt
                                 }: GetBlogOutputModel) => ({
    id,
    name,
    description,
    websiteUrl,
    createdAt
})

export const getPostViewModel = ({
                                     id,
                                     title,
                                     content,
                                     shortDescription,
                                     blogName,
                                     blogId,
                                     createdAt
                                 }: GetPostOutputModel) => ({
    id,
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
