import {commonValidationForBodyStrings, uriIdParamValidation} from '../common';
import {
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
} from "./index";


export const updatePostInputValidations = [
    uriIdParamValidation,
    // commonValidationForBodyStrings,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
