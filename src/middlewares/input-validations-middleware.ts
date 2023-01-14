import {Request, Response, NextFunction} from "express";
import {validationResult} from 'express-validator';

import {HTTP_STATUSES} from '../types';


export const inputValidationsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }: any) => {
        return {
            message: msg,
            field: param
        };
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errors: errors.array({ onlyFirstError: true })});
    } else {
        next();
    }
};
