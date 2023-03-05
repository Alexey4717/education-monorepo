import {ObjectId} from "mongodb";

import {videosCollection} from '../../store/db';
import {GetVideoOutputModelFromMongoDB} from "../../models/VideoModels/GetVideoOutputModel";
import {UpdateVideoInputModel} from "../../models/VideoModels/UpdateVideoInputModel";
import VideoModel from '../../models/VideoModels/Video-model';


interface UpdateVideoArgs {
    id: number
    input: UpdateVideoInputModel
}

export const videosQueryRepository = {
    async getVideos(): Promise<GetVideoOutputModelFromMongoDB[]> {
        try {
            // return await videosCollection.find({}).toArray();
            return await VideoModel.find({}).lean();
        } catch (error) {
            console.log(`VideosQueryRepository get videos error is occurred: ${error}`);
            return [];
        }
    },

    async findVideoById(id: string): Promise<GetVideoOutputModelFromMongoDB | null> {
        try {
            // return await videosCollection.findOne({"_id": new ObjectId(id)});
            return await VideoModel.findOne({"_id": new ObjectId(id)}).lean();
        } catch (error) {
            console.log(`VideosQueryRepository find video by id error is occurred: ${error}`);
            return null;
        }
    },
};
