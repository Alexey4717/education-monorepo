import {Request, Response, Router} from "express";

import {GetVideoOutputModel} from "../../models/GetVideoOutputModel";
import {db} from "../../store/mockedDB";
import {getVideoViewModel, getIsIsoDate, getCorrectIncludesAvailableResolutions} from "../../helpers";
import {GetVideoInputModel} from "../../models/GetVideoInputModel";
import {HTTP_STATUSES, RequestWithBody, RequestWithParamsAndBody, Error} from "../../types";
import {CreateVideoInputModel} from "../../models/CreateVideoInputModel";
import {GetErrorOutputModel} from "../../models/GetErrorOutputModel";
import {UpdateVideoInputModel} from "../../models/UpdateVideoInputModel";


export const videosRouter = Router({});

videosRouter.get('/', (req: Request, res: Response<GetVideoOutputModel[]>) => {
    const resData = db.videos.map(getVideoViewModel);
    res.json(resData);
})
videosRouter.get('/:id', (req: Request<GetVideoInputModel>, res: Response<GetVideoOutputModel>) => {
    const videoId = req.params?.id;
    if (!videoId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const foundVideo = db.videos.find((video) => video.id === +videoId);

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(getVideoViewModel(foundVideo));
})

videosRouter.post(
    '/',
    (
        req: RequestWithBody<CreateVideoInputModel>,
        res: Response<GetVideoOutputModel | GetErrorOutputModel>
    ) => {
        const {
            title,
            author,
            availableResolutions
        } = req.body || {};

        const isInvalidTitle = !title ||
            (typeof title === 'string' && !title.trim()) ||
            typeof title !== 'string' ||
            title?.length > 40;
        const isInvalidAuthor = !author ||
            (typeof author === 'string' && !author?.trim()) ||
            typeof author !== 'string' ||
            author?.length > 20;
        const isInvalidAvailableResolutions = availableResolutions && Boolean(availableResolutions) &&
            (!availableResolutions.length || getCorrectIncludesAvailableResolutions(availableResolutions));

        if (isInvalidTitle || isInvalidAuthor || isInvalidAvailableResolutions) {
            let errorsMessages = [] as Error[];
            if (!title && typeof title !== 'string') {
                errorsMessages.push({message: 'Title is required field', field: 'title'});
            }
            if (typeof title === 'string' && !title.trim()) {
                errorsMessages.push({message: 'Title shouldn`t be empty', field: 'title'});
            }
            if (title && typeof title !== 'string') {
                errorsMessages.push({message: 'Title must be a string', field: 'title'});
            }
            if (title?.length > 40) {
                errorsMessages.push({message: 'Title length shouldn`t be more than 40 symbols', field: 'title'});
            }

            if (!author && typeof author !== 'string') {
                errorsMessages.push({message: 'Author is required field', field: 'author'});
            }
            if (typeof author === 'string' && !author.trim()) {
                errorsMessages.push({message: 'Author shouldn`t be empty', field: 'author'});
            }
            if (author && typeof author !== 'string') {
                errorsMessages.push({message: 'Author must be a string', field: 'author'});
            }
            if (author?.length > 20) {
                errorsMessages.push({message: 'Author length shouldn`t be more than 20 symbols', field: 'author'});
            }

            if (availableResolutions) {
                if (!availableResolutions.length) {
                    errorsMessages.push({
                        message: 'At least one resolution should be added',
                        field: 'availableResolutions'
                    });
                }
                if (availableResolutions.length && getCorrectIncludesAvailableResolutions(availableResolutions)) {
                    errorsMessages.push({
                        message: 'Some item of available resolutions does not match the enum',
                        field: 'availableResolutions'
                    });
                }
            }

            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json({errorsMessages});
            return;
        }

        const currentDate = new Date();
        const createdAt = currentDate.toISOString();
        const publicationDate = new Date(
            new Date(currentDate).setDate(currentDate.getDate() + 1)
        ).toISOString(); // default +1 day from createdAt

        const canBeDownloaded = false; // default
        const minAgeRestriction = null; // default

        const createdVideo = {
            id: new Date().valueOf(),
            title,
            author,
            canBeDownloaded,
            minAgeRestriction,
            createdAt,
            publicationDate,
            availableResolutions: availableResolutions ?? null // null default
        };

        db.videos.push(createdVideo);
        res.status(HTTP_STATUSES.CREATED_201).json(createdVideo)
    })

videosRouter.put(
    '/:id',
    (
        req: RequestWithParamsAndBody<GetVideoInputModel, UpdateVideoInputModel>,
        res: Response<undefined | GetErrorOutputModel>
    ) => {
        const videoId = req.params?.id;

        const findVideoById = (video: GetVideoOutputModel) => video.id === +videoId;

        const foundVideo = db.videos.find(findVideoById);
        const foundVideoIndex = db.videos.findIndex(findVideoById);

        if (!foundVideo || foundVideoIndex === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const {
            title,
            author,
            availableResolutions,
            canBeDownloaded,
            minAgeRestriction,
            publicationDate
        } = req.body || {};

        const isInvalidTitle = !title ||
            (typeof title === 'string' && !title.trim()) ||
            typeof title !== 'string' ||
            title?.length > 40;
        const isInvalidAuthor = !author ||
            (typeof author === 'string' && !author?.trim()) ||
            typeof author !== 'string' ||
            author?.length > 20;
        const isInvalidAvailableResolutions = Boolean(availableResolutions) && availableResolutions &&
            (!availableResolutions.length || getCorrectIncludesAvailableResolutions(availableResolutions));

        if (
            !videoId ||
            isInvalidTitle ||
            isInvalidAuthor ||
            isInvalidAvailableResolutions ||
            (publicationDate && !getIsIsoDate(publicationDate)) ||
            (minAgeRestriction && (
                typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1
            )) ||
            (canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean')
        ) {
            let errorsMessages = [] as Error[];
            if (!title && typeof title !== 'string') {
                errorsMessages.push({message: 'Title is required field', field: 'title'});
            }
            if (typeof title === 'string' && !title.trim()) {
                errorsMessages.push({message: 'Title shouldn`t be empty', field: 'title'});
            }
            if (title && typeof title !== 'string') {
                errorsMessages.push({message: 'Title must be a string', field: 'title'});
            }
            if (title?.length > 40) {
                errorsMessages.push({message: 'Title length shouldn`t be more than 40 symbols', field: 'title'});
            }

            if (!author && typeof author !== 'string') {
                errorsMessages.push({message: 'Author is required field', field: 'author'});
            }
            if (typeof author === 'string' && !author.trim()) {
                errorsMessages.push({message: 'Author shouldn`t be empty', field: 'author'});
            }
            if (author && typeof author !== 'string') {
                errorsMessages.push({message: 'Author must be a string', field: 'author'});
            }
            if (author?.length > 20) {
                errorsMessages.push({message: 'Author length shouldn`t be more than 20 symbols', field: 'author'});
            }

            if (availableResolutions) {
                if (!availableResolutions.length) {
                    errorsMessages.push({
                        message: 'At least one resolution should be added',
                        field: 'availableResolutions'
                    });
                }
                if (availableResolutions.length && getCorrectIncludesAvailableResolutions(availableResolutions)) {
                    errorsMessages.push({
                        message: 'Some item of available resolutions does not match the enum',
                        field: 'availableResolutions'
                    });
                }
            }

            if (publicationDate && !getIsIsoDate(publicationDate)) {
                errorsMessages.push({
                    message: 'Publication date must be a ISO string of date',
                    field: 'publicationDate'
                });
            }

            if (minAgeRestriction) {
                if (typeof minAgeRestriction !== 'number') {
                    errorsMessages.push({
                        message: 'Min age restriction field must be a number type',
                        field: 'minAgeRestriction'
                    });
                }
                if (typeof minAgeRestriction === 'number') {
                    if (minAgeRestriction > 18) {
                        errorsMessages.push({
                            message: 'Min age restriction shouldn`t more than 18',
                            field: 'minAgeRestriction'
                        });
                    } else if (minAgeRestriction < 1) {
                        errorsMessages.push({
                            message: 'Min age restriction shouldn`t less than 1',
                            field: 'minAgeRestriction'
                        });
                    }
                }
            }
            if (typeof canBeDownloaded !== 'boolean') {
                errorsMessages.push({
                    message: 'CanBeDownloaded field must be boolean type',
                    field: 'canBeDownloaded'
                });
            }

            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json({errorsMessages});
            return;
        }

        db.videos[foundVideoIndex] = {
            ...foundVideo,
            title,
            author,
            canBeDownloaded: canBeDownloaded ?? false,
            minAgeRestriction: minAgeRestriction ?? null,
            publicationDate: publicationDate
                ? new Date(publicationDate).toISOString()
                : foundVideo?.publicationDate,
            availableResolutions: availableResolutions ?? null
        };

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

videosRouter.delete('/:id', (req: Request<GetVideoInputModel>, res: Response<void>) => {
    const videoId = req.params?.id;

    if (!videoId) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const foundVideoIndex = db.videos.findIndex((video) => video.id === +videoId);

    if (foundVideoIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const deletedVideo = db.videos.splice(foundVideoIndex, 1);

    if (!deletedVideo.length) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_ERROR_500);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
