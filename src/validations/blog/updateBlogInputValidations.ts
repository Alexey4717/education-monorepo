import {commonValidationForBodyStrings, uriIdParamValidation} from '../common';
import {
    bodySanitization,
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from "./index";

export const updateBlogInputValidations = [
    bodySanitization,
    uriIdParamValidation,
    commonValidationForBodyStrings,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
];
