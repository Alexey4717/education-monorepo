// validation for uri params
import {body, param} from "express-validator";

// удалить (проверка в мидлваре)
export const uriIdParamValidation = param('id')
    .exists()
    .trim()
    .isString()
    .withMessage("Id from URI param should be a string");

export const commonValidationForBodyStrings = (name: string) => body(name)
    .exists()
    .isString().withMessage("Field should be a string")
    .trim().notEmpty().withMessage("Field shouldn`t be empty");
