import {videosCollection} from '../../store/db';
import {GetVideoOutputModelFromMongoDB} from "../../models/VideoModels/GetVideoOutputModel";
import {UpdateVideoInputModel} from "../../models/VideoModels/UpdateVideoInputModel";
import {ObjectId} from "mongodb";

interface UpdateVideoArgs {
    id: number
    input: UpdateVideoInputModel
}

export const videosQueryRepository = {
    async getVideos(): Promise<GetVideoOutputModelFromMongoDB[]> {
        try {
            return await videosCollection.find({}).toArray();
        } catch (error) {
            console.log(`VideosQueryRepository get videos error is occurred: ${error}`);
            return [];
        }
    },

    async findVideoById(id: string): Promise<GetVideoOutputModelFromMongoDB | null> {
        try {
            const foundVideo = await videosCollection.findOne({"_id": new ObjectId(id)});
            return foundVideo ?? null;
        } catch (error) {
            console.log(`VideosQueryRepository find video by id error is occurred: ${error}`);
            return null;
        }
    },
};
