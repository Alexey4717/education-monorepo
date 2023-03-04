import {commonValidationForBodyStrings} from "../common";
import {newPasswordValidation} from "./index";


export const newPasswordInputValidations = [
    commonValidationForBodyStrings('newPassword'),
    newPasswordValidation,
    commonValidationForBodyStrings('recoveryCode'),
];
