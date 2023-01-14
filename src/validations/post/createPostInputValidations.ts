import {commonValidationForBodyStrings} from '../common';
import {
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
} from "./index";


export const createPostInputValidations = [
    commonValidationForBodyStrings,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
