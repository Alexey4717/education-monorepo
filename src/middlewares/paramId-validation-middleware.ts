import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";

import {HTTP_STATUSES} from '../types/common';


export const paramIdValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validityId = ObjectId.isValid(req.params.id)
        if (!validityId) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        next();
    } catch (error) {
        console.log(`URI params Id validation error: ${error}`)
    }
};
