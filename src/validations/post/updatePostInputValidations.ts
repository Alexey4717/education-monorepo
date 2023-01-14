import {commonValidationForBodyStrings, uriIdParamValidation} from '../common';
import {
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    bodySanitization
} from "./index";


export const updatePostInputValidations = [
    bodySanitization,
    uriIdParamValidation,
    commonValidationForBodyStrings,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
