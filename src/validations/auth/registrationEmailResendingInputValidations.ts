import {commonValidationForBodyStrings} from "../common";
import {emailValidation} from "./index";


export const registrationEmailResendingInputValidations = [
    commonValidationForBodyStrings('email'),
    emailValidation
];
