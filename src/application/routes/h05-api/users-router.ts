import {Response, Router} from "express";
import {constants} from 'http2';

import {
    Paginator,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    SortDirections
} from "../../../types/common";
import {DeleteUserInputModel} from "../../../models/UserModels/DeleteUserInputModel";
import {CreateUserInputModel} from "../../../models/UserModels/CreateUserInputModel";
import {GetUsersInputModel} from "../../../models/UserModels/GetUsersInputModel";
import {GetMappedUserOutputModel} from "../../../models/UserModels/GetUserOutputModel";
import {getMappedUserViewModel} from "../../../helpers";
import {usersQueryRepository} from "../../../repositories/Queries-repo/users-query-repository";
import {SortUsersBy} from "../../../models/UserModels/GetUsersInputModel";
import {usersService} from "../../../domain/users-service";
import {adminBasicAuthMiddleware} from "../../../middlewares/admin-basicAuth-middleware";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {createUserInputValidations} from "../../../validations/user/createVideoInputValidations";


export const usersRouter = Router({});

usersRouter.get(
    '/',
    adminBasicAuthMiddleware,
    async (
        req: RequestWithQuery<GetUsersInputModel>,
        res: Response<Paginator<GetMappedUserOutputModel[]>>
    ) => {
        const resData = await usersQueryRepository.getUsers({
            searchLoginTerm: req.query.searchLoginTerm?.toString() || null, // by-default null
            searchEmailTerm: req.query.searchEmailTerm?.toString() || null, // by-default null
            sortBy: (req.query.sortBy?.toString() || 'createdAt') as SortUsersBy, // by-default createdAt
            sortDirection: (req.query.sortDirection?.toString() || SortDirections.desc) as SortDirections, // by-default desc
            pageNumber: +(req.query.pageNumber || 1), // by-default 1
            pageSize: +(req.query.pageSize || 10) // by-default 10
        })
        const {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        } = resData || {};
        res.status(constants.HTTP_STATUS_OK).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(getMappedUserViewModel)
        });
    });

usersRouter.post(
    '/',
    adminBasicAuthMiddleware,
    createUserInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<CreateUserInputModel>,
        res: Response<GetMappedUserOutputModel>
    ) => {
        const createdUser = await usersService.createUser(req.body);
        res.status(constants.HTTP_STATUS_CREATED).json(getMappedUserViewModel(createdUser));
    });

usersRouter.delete(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    async (
        req: RequestWithParams<DeleteUserInputModel>,
        res: Response
    ) => {
        const resData = await usersService.deleteUserById(req.params.id);
        if (!resData) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }
        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    });

