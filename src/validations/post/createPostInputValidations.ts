import {commonValidationForBodyStrings} from '../common';
import {
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
} from "./index";


export const createPostInputValidations = [
    // commonValidationForBodyStrings('title'),
    titleValidation,
    // commonValidationForBodyStrings('shortDescription'),
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
