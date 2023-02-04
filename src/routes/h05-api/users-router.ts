import {Response, Router} from "express";
import {
    HTTP_STATUSES,
    Paginator,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    SortDirections
} from "../../types";
import {DeleteUserInputModel} from "../../models/UserModels/DeleteUserInputModel";
import {CreateUserInputModel} from "../../models/UserModels/CreateUserInputModel";
import {GetUsersInputModel} from "../../models/UserModels/GetUsersInputModel";
import {GetMappedUserOutputModel} from "../../models/UserModels/GetUserOutputModel";
import {getMappedUserViewModel} from "../../helpers";
import {usersQueryRepository} from "../../repositories/Queries-repo/users-query-repository";
import {SortUsersBy} from "../../models/UserModels/GetUsersInputModel";
import {usersService} from "../../domain/users-service";
import {authorizationGuardMiddleware} from "../../middlewares/authorization-guard-middleware";
import {paramIdValidationMiddleware} from "../../middlewares/paramId-validation-middleware";
import {inputValidationsMiddleware} from "../../middlewares/input-validations-middleware";
import {createUserInputValidations} from "../../validations/user/createVideoInputValidations";


export const usersRouter = Router({});

usersRouter.get(
    '/',
    authorizationGuardMiddleware,
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
        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(getMappedUserViewModel)
        });
    });

usersRouter.post(
    '/',
    authorizationGuardMiddleware,
    createUserInputValidations,
    inputValidationsMiddleware,
    async (
        req: RequestWithBody<CreateUserInputModel>,
        res: Response<GetMappedUserOutputModel>
    ) => {
        const createdUser = await usersService.createUser(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(getMappedUserViewModel(createdUser));
    });

usersRouter.delete(
    '/:id([0-9a-f]{24})',
    authorizationGuardMiddleware,
    paramIdValidationMiddleware,
    async (
        req: RequestWithParams<DeleteUserInputModel>,
        res: Response
    ) => {
        const resData = await usersService.deleteUserById(req.params.id);
        if (!resData) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

