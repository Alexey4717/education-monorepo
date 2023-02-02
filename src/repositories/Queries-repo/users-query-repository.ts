import {GetUsersArgs, Paginator, SortDirections} from "../../types";
import {GetUserOutputModelFromMongoDB} from "../../models/UserModels/GetUserOutputModel";
import {calculateAndGetSkipValue} from "../../helpers";
import {usersCollection} from "../../store/db";


export const usersQueryRepository = {
    async getUsers({
                       searchLoginTerm,
                       searchEmailTerm,
                       sortBy,
                       sortDirection,
                       pageNumber,
                       pageSize
                   }
                       : GetUsersArgs): Promise<Paginator<GetUserOutputModelFromMongoDB[]>> {
        try {
            let filter = {} as {login: any, email: any};

            if (searchLoginTerm) filter.login = {$regex: searchLoginTerm, $options: 'i'};
            if (searchEmailTerm) filter.email = {$regex: searchEmailTerm, $options: 'i'};

            const skipValue = calculateAndGetSkipValue({pageNumber, pageSize});
            const items = await usersCollection
                .find(filter)
                .sort({[sortBy]: sortDirection === SortDirections.desc ? -1 : 1})
                .skip(skipValue)
                .limit(pageSize)
                .toArray();
            const totalCount = await usersCollection.count(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                page: pageNumber,
                pageSize,
                totalCount,
                pagesCount,
                items
            }
        } catch (error) {
            console.log(`usersQueryRepository.getUsers error is occurred: ${error}`);
            return {} as Paginator<GetUserOutputModelFromMongoDB[]>;
        }
    }
};