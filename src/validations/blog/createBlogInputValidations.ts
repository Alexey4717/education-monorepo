import {commonValidationForBodyStrings} from '../common';
import {
    bodySanitization,
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from "./index";


export const createBlogInputValidations = [
    bodySanitization,
    commonValidationForBodyStrings,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
];
