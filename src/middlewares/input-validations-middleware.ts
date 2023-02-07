import {Request, Response, NextFunction} from "express";
import {validationResult} from 'express-validator';

import {HTTP_STATUSES} from '../types/common';
import {GetErrorOutputModel} from "../models/GetErrorOutputModel";


export const inputValidationsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }: any) => {
            return {
                message: msg,
                field: param
            };
        };

        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            const errorsBody: GetErrorOutputModel = {errorsMessages: errors.array({ onlyFirstError: true })}
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errorsBody);
        }

        next();
    } catch (error) {
        console.log(`Input validation body error is occurred: ${error}`);
    }
};
