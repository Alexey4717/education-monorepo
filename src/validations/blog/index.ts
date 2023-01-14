import {body} from "express-validator";


export const bodySanitization = body('*').custom((value, {req}) => {
    const requiredFields = ['name', 'description', 'websiteUrl']
    if (Object.keys(req.body).some(field => !requiredFields.includes((field)))) {
        return Promise.reject('Extra field in request body not allowed');
    }
    return true;
})

// validations for blog body post and put
export const nameValidation = body('name')
    .isLength({max: 15}).withMessage("Max field length shouldn`t be more than 15 symbols");
export const descriptionValidation = body('description')
    .isLength({max: 500}).withMessage("Max field length shouldn`t be more than 500 symbols");
export const websiteUrlValidation = body('websiteUrl')
    .isLength({max: 100}).withMessage("Max field length shouldn`t be more than 100 symbols")
    .isURL().withMessage("Field value should be valid url address");
// /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;
