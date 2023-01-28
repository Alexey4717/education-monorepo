import {videosCollection} from '../../store/db';
import {GetVideoOutputModel} from "../../models/VideoModels/GetVideoOutputModel";
import {UpdateVideoInputModel} from "../../models/VideoModels/UpdateVideoInputModel";
import {ObjectId} from "mongodb";

interface UpdateVideoArgs {
    id: string
    input: UpdateVideoInputModel
}

export const videosRepository = {
    async createVideo(newVideo: GetVideoOutputModel): Promise<boolean> {
        try {
            const result =  await videosCollection.insertOne(newVideo);
            return Boolean(result.insertedId)
        } catch (error) {
            console.log(`VideosRepository create video error is occurred: ${error}`)
            return false;
        }
    },

    async updateVideo({id, input}: UpdateVideoArgs): Promise<boolean> {
        try {
            const result = await videosCollection.updateOne(
                {"_id": new ObjectId(id)},
                {$set: input}
            )
            return result?.matchedCount === 1;
        } catch (error) {
            console.log(`VideosRepository update video error is occurred: ${error}`)
            return false;
        }
    },

    async deleteVideoById(id: string): Promise<boolean> {
        try {
            const result = await videosCollection.deleteOne({"_id" : new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(`VideosRepository delete video error is occurred: ${error}`)
            return false;
        }
    }
};
