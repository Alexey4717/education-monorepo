import {body} from "express-validator";


// validations for comment body (post and put methods)
export const contentValidation = body('content')
    .isLength({min: 20, max: 300}).withMessage("Max field length should be from 20 to 300 symbols");
