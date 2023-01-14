import {commonValidationForBodyStrings} from '../common';
import {
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation, bodySanitization
} from "./index";


export const createPostInputValidations = [
    bodySanitization,
    commonValidationForBodyStrings,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
