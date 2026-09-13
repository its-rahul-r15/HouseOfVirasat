import rateLimit from 'express-rate-limit';

const limiter = (max, windowMinutes, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const authLimiter = limiter(5, 15, 'Too many login attempts. Try again in 15 minutes.');
export const checkoutLimiter = limiter(20, 60, 'Too many checkout requests. Try again later.');
export const enquiryLimiter = limiter(5, 60, 'Too many enquiry submissions. Try again later.');
export const publicApiLimiter = limiter(120, 1, 'Too many requests.');
export const uploadLimiter = limiter(10, 60, 'Too many uploads. Try again later.');
