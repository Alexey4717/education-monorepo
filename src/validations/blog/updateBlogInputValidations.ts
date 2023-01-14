import {commonValidationForBodyStrings, uriIdParamValidation} from '../common';
import {
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from "./index";

export const updateBlogInputValidations = [
    uriIdParamValidation,
    commonValidationForBodyStrings,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
];
