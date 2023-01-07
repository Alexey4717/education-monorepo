import {AvailableResolutions, DataBase} from "../types";

export const db: DataBase = {
    videos: [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2023-01-05T10:31:38.546Z",
            publicationDate: "2023-01-05T10:31:38.546Z",
            availableResolutions: [
                AvailableResolutions.P144
            ]
        }
    ]
};
