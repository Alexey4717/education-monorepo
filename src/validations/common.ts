// validation for uri params
import {body, param} from "express-validator";

export const uriIdParamValidation = param('id')
    .exists()
    .trim()
    .isNumeric()
    .withMessage("Id from URI param should be a string");

export const commonValidationForBodyStrings = body('*')
    .isString().withMessage("Field should be a string")
    .trim().notEmpty().withMessage("Field shouldn`t be empty");