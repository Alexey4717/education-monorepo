import {GetVideoOutputModel} from "./models/VideoModels/GetVideoOutputModel";
import {AvailableResolutions} from "./types";
import {GetBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetPostOutputModel} from "./models/PostModels/GetPostOutputModel";
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
                                     websiteUrl
                                 }: GetBlogOutputModel) => ({
    id,
    name,
    description,
    websiteUrl
})

export const getPostViewModel = ({
                                     id,
                                     title,
                                     content,
                                     shortDescription,
                                     blogName,
                                     blogId
                                 }: GetPostOutputModel) => ({
    id,
    title,
    content,
    shortDescription,
    blogName,
    blogId
})

export const getIsIsoDate = (dateString: string): boolean => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !Number.isNaN(date) && date.toISOString() === dateString; // valid date
}

export const getCorrectIncludesAvailableResolutions = (availableResolutions: AvailableResolutions[]): boolean => {
    const enumValues = Object.values(AvailableResolutions)
    const intersections = availableResolutions
        .filter((key) => !enumValues.includes(key));
    return Boolean(intersections.length);
}

export const getEncodedAuthToken = () => {
    return Buffer
        .from(`${db.users[0].login}:${db.users[0].password}`, 'utf-8')
        .toString('base64');
}
