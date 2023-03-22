import {GetMappedVideoOutputModel, GetVideoOutputModelFromMongoDB} from "./models/VideoModels/GetVideoOutputModel";
import {GetBlogOutputModelFromMongoDB, GetMappedBlogOutputModel} from "./models/BlogModels/GetBlogOutputModel";
import {GetMappedPostOutputModel, GetPostOutputModelFromMongoDB} from "./models/PostModels/GetPostOutputModel";
import {AvailableResolutions} from './types/common';
import {db} from "./store/mockedDB";
import {GetMappedUserOutputModel, GetUserOutputModelFromMongoDB} from "./models/UserModels/GetUserOutputModel";
import {MeOutputModel} from "./models/AuthModels/MeOutputModel";
import {
    GetMappedCommentOutputModel,
    LikesInfo,
    LikeStatus,
    TCommentDb,
    TReactions
} from "./models/CommentsModels/GetCommentOutputModel";
import {
    GetMappedSecurityDeviceOutputModel,
    GetSecurityDeviceOutputModelFromMongoDB
} from "./models/SecurityDeviceModels/GetSecurityDeviceOutputModel";


export const getMappedVideoViewModel = ({
                                            _id,
                                            title,
                                            author,
                                            canBeDownloaded,
                                            minAgeRestriction,
                                            createdAt,
                                            publicationDate,
                                            availableResolutions
                                        }: GetVideoOutputModelFromMongoDB): GetMappedVideoOutputModel => ({
    id: _id.toString(),
    title,
    author,
    canBeDownloaded,
    minAgeRestriction,
    createdAt,
    publicationDate,
    availableResolutions
});

export const getMappedBlogViewModel = ({
                                           _id,
                                           name,
                                           description,
                                           websiteUrl,
                                           isMembership,
                                           createdAt
                                       }: GetBlogOutputModelFromMongoDB): GetMappedBlogOutputModel => ({
    id: _id.toString(),
    name,
    description,
    websiteUrl,
    isMembership,
    createdAt
});

export const getMappedPostViewModel = ({
                                           _id,
                                           title,
                                           content,
                                           shortDescription,
                                           blogName,
                                           blogId,
                                           createdAt
                                       }: GetPostOutputModelFromMongoDB): GetMappedPostOutputModel => ({
    id: _id.toString(),
    title,
    content,
    shortDescription,
    blogName,
    blogId,
    createdAt
});

export const getMappedUserViewModel = ({
                                           _id,
                                           accountData,
                                       }: GetUserOutputModelFromMongoDB): GetMappedUserOutputModel => ({
    id: _id.toString(),
    login: accountData.login,
    email: accountData.email,
    createdAt: accountData.createdAt
});

export const getMappedMeViewModel = ({
                                         _id,
                                         accountData,
                                     }: GetUserOutputModelFromMongoDB): MeOutputModel => ({
    email: accountData.email,
    login: accountData.login,
    userId: _id.toString(),
});

export const getMappedCommentViewModel2 = ({
                                              _id,
                                              content,
                                              commentatorInfo,
                                              createdAt,
                                              reactions,
                                              currentUserId
                                          }: TCommentDb & { currentUserId?: string }
): GetMappedCommentOutputModel => {
    const {userId, userLogin} = commentatorInfo || {};

    console.log(currentUserId)
    console.log(reactions)
    const likesInfo = reactions?.length > 0
        ? (reactions.reduce((result: LikesInfo, reaction: TReactions) => {
                if (reaction.likeStatus === LikeStatus.Like) result.likesCount += 1;
                if (reaction.likeStatus === LikeStatus.Dislike) result.dislikesCount += 1;
                if (reaction.userId === currentUserId) {
                    result.myStatus = reaction.likeStatus;
                } else {
                    result.myStatus = LikeStatus.None;
                }
                return result;
            }, {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            })
        ) : ({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None
        });

    return {
        id: _id?.toString(),
        content,
        commentatorInfo: {
            userId,
            userLogin
        },
        createdAt,
        likesInfo,
    }
};

export const getMappedCommentViewModel = ({
                                              _id,
                                              content,
                                              commentatorInfo,
                                              createdAt,
                                              reactions,
                                              // какая-то хрень с передачей currentUserId - всегда undefined
                                              myStatus,
                                          }: TCommentDb & { myStatus: LikeStatus }
): GetMappedCommentOutputModel => {
    const {userId, userLogin} = commentatorInfo || {};

    console.log(myStatus)
    console.log(reactions)
    const reactionsInfo = reactions?.length > 0
        ? (reactions.reduce((result: Omit<LikesInfo, 'myStatus'>, reaction: TReactions) => {
                if (reaction.likeStatus === LikeStatus.Like) result.likesCount += 1;
                if (reaction.likeStatus === LikeStatus.Dislike) result.dislikesCount += 1;
                return result;
            }, {
                likesCount: 0,
                dislikesCount: 0,
            })
        ) : ({
            likesCount: 0,
            dislikesCount: 0,
        });

    return {
        id: _id?.toString(),
        content,
        commentatorInfo: {
            userId,
            userLogin
        },
        createdAt,
        likesInfo: {
            ...reactionsInfo,
            myStatus
        },
    }
};

export const getMappedSecurityDevicesViewModel = ({
                                                      _id,
                                                      ip,
                                                      title,
                                                      lastActiveDate

                                                  }: GetSecurityDeviceOutputModelFromMongoDB): GetMappedSecurityDeviceOutputModel => {
    return {
        deviceId: _id.toString(),
        ip,
        title,
        lastActiveDate
    }
};

export const getCorrectIncludesAvailableResolutions = (availableResolutions: AvailableResolutions[]): boolean => {
    const enumValues = Object.values(AvailableResolutions)
    const intersections = availableResolutions
        .filter((key) => !enumValues.includes(key));
    return Boolean(intersections.length);
};

export const getCorrectCommentLikeStatus = (commentLikeStatus: LikeStatus): boolean => {
    const enumValues = Object.values(LikeStatus)
    return enumValues.includes(commentLikeStatus);
};

export const getEncodedAuthToken = () => {
    return Buffer
        .from(`${db.users[0].login}:${db.users[0].password}`, 'utf-8')
        .toString('base64');
};

type CalculateAndGetSkipValueArgs = {
    pageNumber: number
    pageSize: number
};

export const calculateAndGetSkipValue = ({pageNumber, pageSize}: CalculateAndGetSkipValueArgs) => {
    return (pageNumber - 1) * pageSize;
};
