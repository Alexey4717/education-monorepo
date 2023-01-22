import {videosCollection} from '../store/db';
import {getVideoViewModel} from "../helpers";
import {CreateVideoInputModel} from "../models/VideoModels/CreateVideoInputModel";
import {GetVideoOutputModel} from "../models/VideoModels/GetVideoOutputModel";
import {UpdateVideoInputModel} from "../models/VideoModels/UpdateVideoInputModel";

interface UpdateVideoArgs {
    id: number
    input: UpdateVideoInputModel
}

export const videosRepository = {
    async getVideos(): Promise<GetVideoOutputModel[]> {
        const blogs = await videosCollection.find({}).toArray();
        return (blogs || []).map(getVideoViewModel);
    },

    async findVideoById(id: number): Promise<GetVideoOutputModel | null> {
        const foundBlog = await videosCollection.findOne({id});
        return foundBlog ? getVideoViewModel(foundBlog) : null;
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

        await videosCollection.insertOne(newVideo);
        return getVideoViewModel(newVideo);
    },

    async updateVideo({id, input}: UpdateVideoArgs): Promise<boolean> {
        const result = await videosCollection.updateOne(
            {id},
            {$set: input}
        )
        return result?.matchedCount === 1;
    },

    async deleteVideoById(id: number): Promise<boolean> {
        const result = await videosCollection.deleteOne({id});
        return result.deletedCount === 1;
    }
};
