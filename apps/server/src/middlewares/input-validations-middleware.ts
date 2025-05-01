import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { constants } from 'http2';

import { GetErrorOutputModel } from '../models/GetErrorOutputModel';

export const inputValidationsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const errorFormatter = ({
            location,
            msg,
            param,
            value,
            nestedErrors,
        }: any) => {
            return {
                message: msg,
                field: param,
            };
        };

        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            const errorsBody: GetErrorOutputModel = {
                errorsMessages: errors.array({ onlyFirstError: true }),
            };
            res.status(constants.HTTP_STATUS_BAD_REQUEST).json(errorsBody);
            return; // TODO проверить, не нужно ли возвращать res, сделал прерывание мидлвара
        }

        next();
    } catch (error) {
        console.log(`Input validation body error is occurred: ${error}`);
    }
};
