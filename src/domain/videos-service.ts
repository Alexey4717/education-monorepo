import {CreateVideoInputModel} from "../models/VideoModels/CreateVideoInputModel";
import {GetVideoOutputModel} from "../models/VideoModels/GetVideoOutputModel";
import {UpdateVideoInputModel} from "../models/VideoModels/UpdateVideoInputModel";
import {videosRepository} from "../repositories/videos-repository";

interface UpdateVideoArgs {
    id: number
    input: UpdateVideoInputModel
}

export const videosService = {
    async getVideos(): Promise<GetVideoOutputModel[]> {
        return await videosRepository.getVideos();
    },

    async findVideoById(id: number): Promise<GetVideoOutputModel | null> {
        return await videosRepository.findVideoById(id);
    },

    async createVideo(input: CreateVideoInputModel): Promise<GetVideoOutputModel> {
        const {
            title,
            author,
            availableResolutions
        } = input || {};

        const currentDate = new Date();
        const createdAt = currentDate.toISOString();
        const publicationDate = new Date(
            new Date(currentDate).setDate(currentDate.getDate() + 1)
        ).toISOString(); // default +1 day from createdAt

        const canBeDownloaded = false; // default
        const minAgeRestriction = null; // default

        const newVideo = {
            id: new Date().valueOf(),
            title,
            author,
            canBeDownloaded,
            minAgeRestriction,
            createdAt,
            publicationDate,
            availableResolutions: availableResolutions ?? null // null default
        };

        return await videosRepository.createVideo(newVideo)
    },

    async updateVideo({id, input}: UpdateVideoArgs): Promise<boolean> {
        return await videosRepository.updateVideo({id, input})
    },

    async deleteVideoById(id: number): Promise<boolean> {
        return await videosRepository.deleteVideoById(id);
    }
};
