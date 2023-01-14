import {AvailableResolutions} from '../../types';

export type GetVideoOutputModel = {
    /**
     * id of video from db
     */
    id: number

    /**
     * video title
     */
    title: string

    /**
     * video author
     */
    author: string

    /**
     * showing can video is downloaded. By default - false.
     */
    canBeDownloaded: boolean

    /**
     * min age restriction for watching video. Min - 0, max - 18, null - no restriction. By default - null.
     */
    minAgeRestriction: number | null

    /**
     * Date of created video.
     */
    createdAt: string

    /**
     * Date of publication video. By default - next day after date of created video.
     */
    publicationDate: string

    /**
     * Available resolutions of video (enum), can be nullable.
     */
    availableResolutions: AvailableResolutions[] | null
}
