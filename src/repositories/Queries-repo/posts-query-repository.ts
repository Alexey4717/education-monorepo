import {GetPostOutputModelFromMongoDB} from "../../models/PostModels/GetPostOutputModel";
import {UpdatePostInputModel} from "../../models/PostModels/UpdatePostInputModel";
import {postsCollection} from "../../store/db";
import {ObjectId} from "mongodb";

interface UpdatePostArgs {
    id: string
    input: UpdatePostInputModel
}

export const postsQueryRepository = {
    async getPosts(): Promise<GetPostOutputModelFromMongoDB[]> {
        try {
            return await postsCollection.find({}).toArray();
        } catch (error) {
            console.log(`postsQueryRepository.getPosts error is occurred: ${error}`);
            return [];
        }
    },

    async findPostById(id: string): Promise<GetPostOutputModelFromMongoDB | null> {
        try {
            const foundPost = await postsCollection.findOne({"_id": new ObjectId(id)});
            return foundPost ?? null;
        }  catch (error) {
            console.log(`postsQueryRepository.findPostById error is occurred: ${error}`);
            return null;
        }
    },
};
