import rateLimit from 'express-rate-limit'


export const rateLimitMiddleware = rateLimit({
    windowMs: 10,
    max: 5,
    message:
        'Too many queries sent from this IP, please try again after an 10 seconds',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
