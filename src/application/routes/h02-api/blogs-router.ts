import {Router} from "express";

import {inputValidationsMiddleware} from "../../../middlewares/input-validations-middleware";
import {createBlogInputValidations} from "../../../validations/blog/createBlogInputValidations";
import {updateBlogInputValidations} from "../../../validations/blog/updateBlogInputValidations";
import {adminBasicAuthMiddleware} from "../../../middlewares/admin-basicAuth-middleware";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";
import {createPostInBlogInputValidations} from "../../../validations/blog/createPostInBlogInputValidations";
import {blogControllers} from "../../../controllers/blog-controllers";


export const blogsRouter = Router({});

blogsRouter.get(
    '/',
    blogControllers.getBlogs
);
blogsRouter.get(
    '/:id([0-9a-f]{24})',
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    blogControllers.getBlog
);
blogsRouter.get(
    '/:id([0-9a-f]{24})/posts',
    paramIdValidationMiddleware,
    blogControllers.getPostsOfBlog
);

blogsRouter.post(
    '/',
    adminBasicAuthMiddleware,
    createBlogInputValidations,
    inputValidationsMiddleware,
    blogControllers.createBlog
);
blogsRouter.post(
    '/:id([0-9a-f]{24})/posts',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    createPostInBlogInputValidations,
    inputValidationsMiddleware,
    blogControllers.createPostInBlog
);

blogsRouter.put(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    updateBlogInputValidations,
    inputValidationsMiddleware,
    blogControllers.updateBlog
);

blogsRouter.delete(
    '/:id([0-9a-f]{24})',
    adminBasicAuthMiddleware,
    paramIdValidationMiddleware,
    inputValidationsMiddleware,
    blogControllers.deleteBlog
);
