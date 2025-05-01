// validation for uri params
import { body } from 'express-validator';

export const commonValidationForBodyStrings = (name: string) =>
    body(name)
        .exists()
        .isString()
        .withMessage('Field should be a string')
        .trim()
        .notEmpty()
        .withMessage('Field shouldn`t be empty');
