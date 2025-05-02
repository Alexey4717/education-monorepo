import { ObjectId } from 'mongodb';

import { AvailableResolutions } from '../../types/common';

export type GetVideoOutputModel = {
	/**
	 * @format video title
	 * @example "Video title"
	 */
	title: string;

	/**
	 * @format video author
	 * @example "Alex"
	 */
	author: string;

	/**
	 * @format showing can video is downloaded. By default - false.
	 * @example false
	 */
	canBeDownloaded: boolean;

	/**
	 * @format min age restriction for watching video. Min - 0, max - 18, null - no restriction. By default - null.
	 * @example 18
	 */
	minAgeRestriction: number | null;

	/**
	 * @format Date of created video.
	 * @example "2024-05-20T10:00:00Z"
	 */
	createdAt: string;

	/**
	 * @format Date of publication video. By default - next day after date of created video.
	 * @example "2024-05-20T10:00:00Z"
	 */
	publicationDate: string;

	/**
	 * @format Available resolutions of video (enum), can be nullable.
	 * @example ["P720", "P1080"]
	 */
	availableResolutions: AvailableResolutions[] | null;
};

export type GetVideoOutputModelFromMongoDB = GetVideoOutputModel & {
	/**
	 * @format Inserted id video from mongodb
	 * @example "00000001-0000001-222222-022222"
	 */
	_id: ObjectId;
};

export type GetMappedVideoOutputModel = GetVideoOutputModel & {
	/**
	 * @format Mapped id of video from db
	 * @example "00000001-0000001-222222-022222"
	 */
	id: string;
};
