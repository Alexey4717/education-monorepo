import {videosCollection} from '../store/db';
import {getVideoViewModel} from "../helpers";
import {GetVideoOutputModel} from "../models/VideoModels/GetVideoOutputModel";
import {UpdateVideoInputModel} from "../models/VideoModels/UpdateVideoInputModel";

interface UpdateVideoArgs {
    id: number
    input: UpdateVideoInputModel
}

export const videosRepository = {
    async getVideos(): Promise<GetVideoOutputModel[]> {
        const videos = await videosCollection.find({}).toArray();
        return (videos || []).map(getVideoViewModel);
    },

    async findVideoById(id: number): Promise<GetVideoOutputModel | null> {
        const foundVideo = await videosCollection.findOne({id});
        return foundVideo ? getVideoViewModel(foundVideo) : null;
    },

    async createVideo(newVideo: GetVideoOutputModel): Promise<GetVideoOutputModel> {
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
