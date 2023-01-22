import {commonValidationForBodyStrings, uriIdParamValidation} from '../common';
import {
    authorValidation,
    availableResolutionsValidation,
    canBeDownloadedValidation,
    minAgeRestrictionValidation,
    publicationDateValidation,
    titleValidation,
} from "./index";

export const updateVideoInputValidations = [
    uriIdParamValidation,
    commonValidationForBodyStrings('title'),
    titleValidation,
    commonValidationForBodyStrings('author'),
    authorValidation,
    availableResolutionsValidation,
    canBeDownloadedValidation,
    minAgeRestrictionValidation,
    publicationDateValidation
];
