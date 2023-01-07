import {GetVideoOutputModel} from "./models/GetVideoOutputModel";
import {AvailableResolutions} from "./types";

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

export const isIsoDate = (dateString: string): boolean => {
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
