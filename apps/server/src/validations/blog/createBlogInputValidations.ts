import { commonValidationForBodyStrings } from '../common';
import {
    descriptionValidation,
    nameValidation,
    websiteUrlValidation,
} from './index';

export const createBlogInputValidations = [
    commonValidationForBodyStrings('name'),
    nameValidation,
    commonValidationForBodyStrings('description'),
    descriptionValidation,
    commonValidationForBodyStrings('websiteUrl'),
    websiteUrlValidation,
];
